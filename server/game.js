const Packets = require('./../shared/packets.js');

const Player = require('./player.js');
const User = require('./user.js');

class Game {

    constructor(users) {
        this.users = users;
        this.playerInfo = [];
        this.currentPlayerIndex = 0;
        for (let user of this.users) {
            let player = new Player(user.getName(), 1500);
            this.playerInfo.push({player: player, user: user});
            let network = user.getClient().network;
            network.link(Packets.PlayerEndTurnPacket, this.onPlayerEndTurnPacket)
        }
    }

    start() {
        let gameStartPacket = new Packets.GameStartPacket();
        this.broadcast(gameStartPacket);
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

    onPlayerEndTurnPacket(sender, packet) {
        let player = this.senderToPlayer(sender);
        if (player == this.getCurrentPlayer()) {
            this.nextTurn();
        }
    }

    getCurrentPlayer() {
        return this.playerInfo[this.currentPlayerIndex].player;
    }

    nextTurn() {
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
    }

    broadcast(packet) {
        for (let user of this.users) {
            user.send(packet);
        }
    }

}

module.exports = Game;