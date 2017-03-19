const Packets = require('./../shared/packets.js');
const Player = require('./../shared/player.js');

const User = require('./user.js');

class Game {

    constructor(users) {
        this.users = users;
        this.players = [];
        for(let user of this.users) {
            let player = new Player(user.getName());
            this.players.push(player);
        }
    }

    start() {
        let gameStartPacket = new Packets.GameStartPacket();
        this.broadcast(gameStartPacket);
        this.currentPlayerOffset = Game.random(0, this.players.length);
        this.nextTurn();
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerOffset];
    }

    nextTurn() {
        if(this.turnTimeout) {
            clearTimeout(this.turnTimeout);
        }

        let turnTime = 5 * 60 * 1000;
        let that = this;
        this.turnTimeout = setTimeout(() => {
            that.nextTurn();
        }, turnTime);

        this.currentPlayerOffset = this.currentPlayerOffset + 1 % this.players.length;
        this.broadcast(new Packets.NextTurnPacket(this.getCurrentPlayer(), turnTime));
    }

    static random(min, max) {
        return Math.random() * (max - min) + min;
    }

    broadcast(packet) {
        for(let user of this.users) {
            user.send(packet);
        }
    }

}

module.exports = Game;