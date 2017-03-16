let User = require('./_class/user.js');
let Game = require('./_class/game.js');

let syc = new User('Syc', 0);
let shadow = new User('Shadow992', 1);
let game = new Game([syc, shadow]);

console.log(game.players);
game.fields.forEach(function(field) {
    console.log(field);
});