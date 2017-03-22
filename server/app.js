const PacketManager = require('./../shared/packetManager.js');
const Packets = require('./../shared/packets.js');
PacketManager.initialize(Packets);

const GameServer = require('./gameServer');
new GameServer().start();

const WebServer = require('./webServer');
new WebServer().start();