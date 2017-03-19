const EventHandler = require('./../shared/eventHandler.js');
const Packets = require('./../shared/packets.js');

class Client {

    constructor(id, socket) {
        this.id = id;
        this.network = new EventHandler();
        this.socket = socket;
        this.socket.on('packet', (data) => {
            try {
                let packet = Packets.PacketManager.parse(data);
                this.network.dispatch(this, packet);
            } catch(ex) {
                console.log(ex);
            }
        });

        this.user = null;

        this.network.link(Packets.LoginPacket, (sender, packet) => {
            console.log(packet.username);
        });

        var that = this;
        setInterval(() => {
            that.send(new Packets.PingPacket());
        }, 1000);
    }

    getSocket() {
        return this.socket;
    }

    getUser() {
        return this.user;
    }

    send(packet) {
        this.socket.emit('packet', Packets.PacketManager.pack(packet));
    }

}

module.exports = Client;