let User = require('./_class/user.js');
let Board = require('./_class/board.js');

let syc = new User('Syc');
let board = new Board();
board.setPlayers(syc);
board.initializeFields();

console.log(board.getPlayers());
board.getFields().forEach(function(field) {
    console.log(field);
});