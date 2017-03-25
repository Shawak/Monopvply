const EventHandler = require('./../shared/eventHandler.js');
const PacketManager = require('./../shared/packetManager.js');
const Packets = require('./../shared/packets.js');

const User = require('./user.js');
const Game = require('./game.js');

class Client {

    constructor(server, id, socket) {
        this.server = server;
        this.id = id;
        this.socket = socket;
        this.user = null;

        this.socket.on('packet', (data) => {
            try {
                let packet = PacketManager.parse(data);
                this.network.dispatch(this, packet);
            } catch(ex) {
                console.log(ex);
            }
        });

        this.network = new EventHandler();
        this.network.link(Packets.LoginPacket, this.onLoginPacket, this);
        this.network.link(Packets.CreateLobbyPacket, this.onCreateLobbyPacket, this);
        this.network.link(Packets.JoinLobbyPacket, this.onJoinLobbyPacket, this);

        /*setInterval(() => this.send(new Packets.PingPacket()), 1000);*/
    }

    getNetwork() {
        return this.network;
    }

    onLoginPacket(sender, packet) {
        if(!this.user) {
            console.log(packet.username + ' logged in!');
            this.user = new User(0, packet.username);
            new Game([this]).start();
        }
    }

    onCreateLobbyPacket(sender, packet) {
        if(this.user) {
            this.server.createLobby(this);
        }
    }

    onJoinLobbyPacket(sender, packet) {
        let lobby = this.server.getLobby(packet.lobbyID);
        if(lobby && this.user) {
            lobby.join(this);
        }
    }

    send(packet) {
        // console.log('[' + (this.user ? this.user.getName() : this.id) + '] ' + Packets.PacketManager.pack(packet));
        this.socket.emit('packet', PacketManager.pack(packet));
    }

}

module.exports = Client;