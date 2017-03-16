class Client {

    constructor(socket) {
        this.socket = socket;
        this.user = null;
    }

    getSocket() {
        return this.socket;
    }

    getUser() {
        return this.user;
    }

    send(data) {
        this.socket.send(data);
    }

    onData(data) {
        let packet = packet.packetManager.parse(data);
    }

}

module.exports = Client;