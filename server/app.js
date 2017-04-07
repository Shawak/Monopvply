const PacketManager = require('./../shared/packetManager.js');
const Packets = require('./../shared/packets.js');
PacketManager.initialize(Packets);

const Database = require('./database.js');
const GameServer = require('./gameServer.js');
const WebServer = require('./webServer.js');

let db = new Database();
db.sync().then(() => {
    new GameServer(db).start();
    new WebServer().start();
});