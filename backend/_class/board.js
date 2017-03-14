let Field = require('./board/field.js');

let Board = function() {
    this.players = [];
    this.fields = [];
};

Board.prototype.setPlayers = function(players) {
    this.players = players;
};

Board.prototype.getPlayers = function() {
    return this.players;
};

Board.prototype.initializeFields = function() {
    for (let i = 0; i < 40; i++) {
        this.fields.push(new Field(i));
    }
};

Board.prototype.getFields = function() {
    return this.fields;
};

module.exports = Board;