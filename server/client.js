const EventHandler = require('./../shared/eventHandler.js');
const PacketManager = require('./../shared/packetManager.js');
const Packets = require('./../shared/packets.js');

const User = require('./user.js');

class Client {

    constructor(server, id, socket) {
        this.id = id;
        this.socket = socket;

        this.socket.on('packet', (data) => {
            try {
                let packet = PacketManager.parse(data);
                this.network.dispatch(this, packet);
            } catch(ex) {
                console.log(ex);
            }
        });

        this.network = new EventHandler();
        this.network.link(Packets.LoginPacket, this.onLoginPacket);
        this.network.link(Packets.CreateLobbyPacket, this.onCreateLobbyPacket);

        /*setInterval(() => this.send(new Packets.PingPacket()), 1000);*/
    }

    onLoginPacket(sender, packet) {
        console.log(packet.username + ' logged in!');
        this.user = new User(this, packet.username);
    }

    onCreateLobbyPacket(sender, packet) {

    }

    getUser() {
        return this.user;
    }

    send(packet) {
        // console.log('[' + (this.user ? this.user.getName() : this.id) + '] ' + Packets.PacketManager.pack(packet));
        this.socket.emit('packet', PacketManager.pack(packet));
    }

}

module.exports = Client;