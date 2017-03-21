const Packets = require('../shared/packets.js');

const User = require('./user.js');
const Player = require('./player.js');

const Monopvply = require('./rules/monopvply.js');

class Game {

    constructor(users) {
        this.users = users;
        this.playerInfo = [];
        this.currentPlayerIndex = 0;
        this.playerCanEndTurn = false;
        let players = [];
        for (let user of this.users) {
            let player = new Player(user.getName());
            players.push(player);
            this.playerInfo.push({player: player, user: user});
            let network = user.getClient().network;
            network.link(Packets.PlayerEndTurnPacket, this.onPlayerEndTurnPacket);
            network.link(Packets.PlayerBuyPacket, this.onPlayerBuyPacket);
        }
        this.map = new Monopvply(this, players);
    }

    start() {
        this.map.onStart(this);
        this.broadcast(new Packets.GameStartPacket(this.map.players, this.map.field));
        this.nextTurn();
    }

    senderToPlayer(sender) {
        for (let info of this.playerInfo) {
            if (sender == info.user.getClient()) {
                return info.player;
            }
        }
        return null;
    }

    getCurrentPlayer() {
        return this.playerInfo[this.currentPlayerIndex].player;
    }

    nextTurn() {
        this.playerCanEndTurn = false;
        if (this.turnTimeout) {
            clearTimeout(this.turnTimeout);
        }

        let turnTime = 5 * 60 * 1000;
        let that = this;
        this.turnTimeout = setTimeout(() => {
            that.nextTurn();
        }, turnTime);

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.playerInfo.length;
        this.broadcast(new Packets.NextTurnPacket(this.getCurrentPlayer(), turnTime));

        setTimeout(() => {
            let player = that.getCurrentPlayer();
            let rollResult = [Game.random(1, 6), Game.random(1, 6)];
            this.broadcast(new Packets.DiceResultPacket(player, rollResult));
            that.map.onMove(that, player, rollResult[0] + rollResult[1]);
            this.broadcast(new Packets.UpdatePlayersPacket(that.map.players));
            that.playerCanEndTurn = true;
        }, 2000);
    }

    // min & max inclusive
    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    broadcast(packet) {
        for (let user of this.users) {
            user.send(packet);
        }
    }

    onPlayerEndTurnPacket(sender, packet) {
        let player = this.senderToPlayer(sender);
        if (player == this.getCurrentPlayer() && this.playerCanEndTurn) {
            this.nextTurn();
        }
    }

    onPlayerBuyPacket(sender, packet) {
        let player = this.senderToPlayer(sender);
        if(player != this.getCurrentPlayer())
            return;

        this.map.onBuy(this, player, packet.fieldID);
        this.broadcast(new Packets.UpdatePlayersPacket(this.map.players));
    }

}

module.exports = Game;