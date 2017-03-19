class User {

    constructor(client) {
        this.client = client;
        this.name = null;
    }

    send(packet) {
        this.client.send(packet);
    }

    getName() {
        return this.name;
    }

}

module.exports = User;