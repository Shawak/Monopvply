let Street = require('./street.js');

let Game = function() {
    this.players = [];
    this.streets = [];
};

Game.prototype.addPlayer = function(player) {
    this.players.push(player);
};

Game.prototype.addPlayers = function(players) {
    players.forEach(function(player) {
        this.players.addPlayer(player);
    });
};

Game.prototype.initializeStreets = function() {
    for (let i = 0; i < 30; i++) {
        this.streets.push(new Street(i));
    }
};

module.exports = Game;