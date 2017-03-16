class Client {

    constructor(id, socket) {
        this.id = id;
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

}

module.exports = Client;