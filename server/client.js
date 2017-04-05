const EventHandler = require('./../shared/eventHandler.js');
const PacketManager = require('./../shared/packetManager.js');
const Packets = require('./../shared/packets.js');

const User = require('./user.js');
const Event = require('./event.js');

class Client {

    constructor(server, id, socket) {
        this.server = server;
        this.id = id;
        this.socket = socket;
        this.user = null;
        this.onDisconnect = new Event(this);
        this.onDisconnect.add(() => {
            if(this.user) {
                console.log(this.user.name + ' logged out!')
            }
        }, this);

        this.socket.on('packet', (data) => {
            try {
                let packet = PacketManager.parse(data);
                this.network.dispatch(this, packet);
            } catch (ex) {
                console.log(ex);
            }
        });

        this.network = new EventHandler();
        this.network.link(Packets.LoginPacket, this.onLoginPacket, this);
        this.network.link(Packets.RequestLobbiesPacket, this.onRequestLobbiesPacket, this);
        this.network.link(Packets.CreateLobbyPacket, this.onCreateLobbyPacket, this);
        this.network.link(Packets.JoinLobbyPacket, this.onJoinLobbyPacket, this);

        /*setInterval(() => this.send(new Packets.PingPacket()), 1000);*/
    }

    onLoginPacket(sender, packet) {
        if (!this.user) {
            // TODO: Login using the Database
            console.log(packet.username + ' logged in!');
            this.user = new User(0, packet.username);
            this.send(new Packets.LoginResultPacket(true));
        }
    }

    onRequestLobbiesPacket(sender, packet) {
        let lobbies = [];
        for (let lobby of this.server.getLobbies()) {
            lobbies.push({
                id: lobby.id,
                name: lobby.name,
                clients: lobby.getClientsCount()
            });
        }
        this.send(new Packets.ListLobbiesPacket(lobbies));
    }

    onCreateLobbyPacket(sender, packet) {
        if (this.user) {
            let lobby = this.server.createLobby();
            lobby.join(this);
        }
    }

    onJoinLobbyPacket(sender, packet) {
        let lobby = this.server.getLobby(packet.lobbyID);
        if (lobby && this.user) {
            lobby.join(this);
        }
    }

    send(packet) {
        // console.log('[' + (this.user ? this.user.name : this.id) + '] ' + PacketManager.pack(packet));
        this.socket.emit('packet', PacketManager.pack(packet));
    }

}

module.exports = Client;