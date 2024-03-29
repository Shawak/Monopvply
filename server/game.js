const Packets = require('../shared/packets.js');

const Player = require('./player.js');
const Field = require('./field.js');

const Monopvply = require('./rules/monopvply.js');

class Game {

    constructor(clients) {
        this.playerInfo = [];
        this.currentPlayerIndex = 0;
        this.turnCount = 0;
        this.playerCanEndTurn = false;
        this.trades = [];

        let colors = ['red', 'orange', 'blue', 'yellow'];
        let i = 0;
        for (let client of clients) {
            let color = colors.length > 0 ? colors[this.random(0, colors.length - 1)] : 'white';
            colors.splice(colors.indexOf(color));
            this.playerInfo.push({client: client, player: new Player(i++, client.user.name, color)});
            client.network.link(Packets.PlayerEndTurnPacket, this.onPlayerEndTurnPacket, this);
            client.network.link(Packets.PlayerBuyPacket, this.onPlayerBuyPacket, this);
            client.network.link(Packets.ChatMessagePacket, this.onChatMessagePacket, this);
            client.network.link(Packets.TradeOfferPacket, this.onTradeOfferPacket, this);
            client.network.link(Packets.TradeAnswerPacket, this.onTradeAnswerPacket, this);
            client.network.link(Packets.PlayerMortgagePacket, this.onPlayerMortgagePacket, this);
            client.network.link(Packets.PlayerUnmortgagePacket, this.onPlayerUnmortgagePacket, this);
            client.network.link(Packets.PlayerBuildPacket, this.onPlayerBuildPacket, this);
            client.network.link(Packets.PlayerJailAnswerPacket, this.PlayerJailAnswerPacket, this);
        }
        this.map = new Monopvply(this, this.getPlayers());
    }

    getGameState() {
        return JSON.stringify({
            players: this.map.getPlayers(),
            fields: this.map.getFields()
        });
    }

    start() {
        this.map.onStart(this);
        for (let info of this.playerInfo) {
            info.client.send(new Packets.GameStartPacket(this.map.players, this.map.fields, info.player.id));
        }
        setTimeout(() => this.nextTurn(), 2000); // TODO fix client to be able to receive faster
    }

    getPlayers() {
        let players = [];
        for (let info of this.playerInfo) {
            players.push(info.player);
        }
        return players;
    }

    senderToPlayer(sender) {
        for (let info of this.playerInfo) {
            if (sender == info.client) {
                return info.player;
            }
        }
        return null;
    }

    playerToClient(player) {
        for (let info of this.playerInfo) {
            if (player == info.player) {
                return info.client;
            }
        }
        return null;
    }

    getCurrentPlayer() {
        return this.playerInfo[this.currentPlayerIndex].player;
    }

    getPlayerByID(id) {
        for (let info of this.playerInfo) {
            if (id == info.player.id) {
                return info.player;
            }
        }
        return null;
    }

    // min & max inclusive
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    nextTurn() {
        this.playerCanEndTurn = false;
        if (this.turnTimeout) {
            clearTimeout(this.turnTimeout);
        }

        if (this.turnCount != 0) {
            this.map.onEndTurn(this, this.getCurrentPlayer());
        }

        this.turnCount++;

        let turnTime = 3 * 60 * 1000;
        this.turnTimeout = setTimeout(() => this.nextTurn(), turnTime);

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.playerInfo.length;
        let player = this.getCurrentPlayer();

        this.broadcast(new Packets.NextTurnPacket(player, turnTime, new Date().getTime()));
        this.map.onTurn(this, player);

        setTimeout(() => this.playerCanEndTurn = true, 1000);
    }

    sendDices(rolls) {
        this.broadcast(new Packets.DiceResultPacket(this.getCurrentPlayer(), rolls));
    }

    broadcast(packet) {
        for (let info of this.playerInfo) {
            info.client.send(packet);
        }
    }

    msg(message, player) {
        let packet = new Packets.ChatMessagePacket(null, message);
        if (player)
            this.playerToClient(player).send(packet);
        else
            this.broadcast(packet);
    }

    update(obj) {
        if (obj instanceof Player) {
            this.broadcast(new Packets.UpdatePlayerPacket(obj));
        } else if (obj instanceof Field) {
            this.broadcast(new Packets.UpdateFieldPacket(obj));
        }
    }

    onPlayerEndTurnPacket(sender, packet) {
        let player = this.senderToPlayer(sender);
        if (player != this.getCurrentPlayer() || !this.playerCanEndTurn)
            return;

        this.nextTurn();
    }

    onPlayerBuyPacket(sender, packet) {
        let player = this.senderToPlayer(sender);
        if (player != this.getCurrentPlayer())
            return;

        this.map.onBuy(this, player, packet.fieldID);
    }

    onChatMessagePacket(sender, packet) {
        let player = this.senderToPlayer(sender);
        this.broadcast(new Packets.ChatMessagePacket(player, packet.message));
    }

    onTradeOfferPacket(sender, packet) {
        let player = this.senderToPlayer(sender);
        packet.from = player.id;

        let otherPlayer = this.getPlayerByID(packet.to);
        if (!otherPlayer) {
            return;
        }

        if (packet.from === null) {
            console.log('could not find from player on trade.');
            return;
        }
        if (packet.to === null) {
            console.log('could not find to player on trade.');
            return;
        }
        if (packet.receive.money === null) {
            packet.receive.money = 0;
        }
        if (packet.offer.money === null) {
            packet.offer.money = 0;
        }
        if (packet.offer.streets === null) {
            packet.offer.streets = [];
        }
        if (packet.receive.streets === null) {
            packet.receive.streets = [];
        }

        let tradeID = 0;
        while (this.trades.find(trade => trade.tradeID == tradeID))
            tradeID++;
        packet.tradeID = tradeID;
        this.trades.push(packet);
        this.broadcast(packet);
    }

    onTradeAnswerPacket(sender, packet) {
        let trade = this.trades.find(trade => trade.tradeID == packet.tradeID);
        if (!trade) {
            return;
        }

        this.broadcast(packet);

        let from = this.getPlayerByID(trade.from);
        let to = this.getPlayerByID(trade.to);
        this.map.onTrade(this, packet.accept, from, trade.offer, to, trade.receive);
        this.trades.splice(this.trades.indexOf(trade), 1);
    }

    onPlayerMortgagePacket(sender, packet) {
        let player = this.senderToPlayer(sender);
        if (player != this.getCurrentPlayer())
            return;

        this.map.onMortgage(this, player, packet.fieldID);
    }

    onPlayerUnmortgagePacket(sender, packet) {
        let player = this.senderToPlayer(sender);
        if (player != this.getCurrentPlayer())
            return;

        this.map.onUnmortgage(this, player, packet.fieldID);
    }

    onPlayerBuildPacket(sender, packet) {
        let player = this.senderToPlayer(sender);
        if (player != this.getCurrentPlayer())
            return;

        this.map.onBuild(this, player, packet.fieldID, packet.house);
    }

    PlayerJailAnswerPacket(sender, packet) {
        let player = this.senderToPlayer(sender);
        if (player != this.getCurrentPlayer())
            return;

        this.map.onJail(this, player, packet.buyFree);
    }
}

module.exports = Game;