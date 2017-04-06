const PacketManager = require('./../shared/packetManager.js');
const Packets = require('./../shared/packets.js');
PacketManager.initialize(Packets);

const GameServer = require('./gameServer.js');
new GameServer().start();

const WebServer = require('./webServer.js');
new WebServer().start();