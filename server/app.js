const WebServer = require('./webServer');
const GameServer = require('./gameServer');

new WebServer().start();
new GameServer().start();