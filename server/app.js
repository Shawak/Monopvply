const PacketManager = require('./../shared/packetManager.js');
const Packets = require('./../shared/packets.js');
PacketManager.initialize(Packets);

const WebServer = require('./webServer');
const GameServer = require('./gameServer');

new WebServer().start();
new GameServer().start();