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
            network.link(Packets.ChatMessagePacket, this.onChatMessagePacket);
        }
        this.map = new Monopvply(this, players);
    }

    start() {
        this.map.onStart(this);
        this.broadcast(new Packets.GameStartPacket(this.map.players, this.map.fields));
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

    // min & max inclusive
    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    nextTurn() {
        this.playerCanEndTurn = false;
        if (this.turnTimeout) {
            clearTimeout(this.turnTimeout);
        }

        let turnTime = 5 * 60 * 1000;
        this.turnTimeout = setTimeout(() => this.nextTurn(), turnTime);

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.playerInfo.length;
        let player = this.getCurrentPlayer();

        this.broadcast(new Packets.NextTurnPacket(player, turnTime));
        this.map.onTurn(this, player);

        setTimeout(() => this.playerCanEndTurn = true, 2000);
    }

    sendDices(rolls) {
        this.broadcast(new Packets.DiceResultPacket(this.getCurrentPlayer(), rolls));
    }

    broadcast(packet) {
        for (let user of this.users) {
            user.send(packet);
        }
    }

    update(obj) {
        switch(Object.getPrototypeOf(obj)) {
            case Player:
                this.broadcast(new Packets.UpdatePlayerPacket(obj));
                break;
            case Field:
                this.broadcast(new Packets.UpdateFieldPacket(obj));
                break;
        }
    }

    onPlayerEndTurnPacket(sender, packet) {
        let player = this.senderToPlayer(sender);
        if(player != this.getCurrentPlayer() || !this.playerCanEndTurn)
            return;

        this.nextTurn();
    }

    onPlayerBuyPacket(sender, packet) {
        let player = this.senderToPlayer(sender);
        if(player != this.getCurrentPlayer())
            return;

        this.map.onBuy(this, player, packet.fieldID);
    }

    onChatMessagePacket(sender, packet) {
        let player = this.senderToPlayer(sender);
        if(!player)
            return;

        this.broadcast(new Packets.ChatMessagePacket(player, packet.message));
    }

}

module.exports = Game;