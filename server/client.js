const EventHandler = require('./../shared/eventHandler.js');
const Packets = require('./../shared/packets.js');

const User = require('./user.js');
const Game = require('./game.js');

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

        let that = this;
        this.network.link(Packets.LoginPacket, (sender, packet) => {
            console.log(packet.username + ' logged in!');
            that.user = new User(this);
            that.user.name = packet.username;

            let game = new Game([this.getUser()]);
            game.start();
        });

        setInterval(() => {
            //that.send(new Packets.PingPacket());
        }, 1000);
    }

    getUser() {
        return this.user;
    }

    send(packet) {
        // console.log('[' + (this.user ? this.user.getName() : this.id) + '] ' + Packets.PacketManager.pack(packet));
        this.socket.emit('packet', Packets.PacketManager.pack(packet));
    }

}

module.exports = Client;