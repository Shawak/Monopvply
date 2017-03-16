let User = require('./_class/user.js');
let Game = require('./_class/game.js');

let syc = new User('Syc');
let shadow = new User('Shadow992');
let game = new Game();
game.addPlayers([syc, shadow]);
game.initializeStreets();

console.log(game.players);
game.streets.forEach(function(street) {
    console.log(street);
});