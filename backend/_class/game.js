let Field = require('./field.js');

let Game = function(players) {
    this.players = [];
    this.fields = [];
    this.addPlayers(players);
    this.initializeFields();
};

Game.prototype.addPlayer = function(player) {
    this.players.push(player);
};

Game.prototype.addPlayers = function(players) {
    let _this = this;
    players.forEach(function(player) {
        _this.addPlayer(player);
    });
};

Game.prototype.initializeFields = function() {
    let streetCount = 0;
    for (let i = 0; i < 30; i++) {
        this.fields.push(new Field(i, streetCount));
        if (this.fields[this.fields.length-1].isStreet) streetCount++;
    }
};

module.exports = Game;