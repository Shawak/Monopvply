class User {

    constructor(client, name) {
        this.client = client;
        this.name = name;
    }

    send(packet) {
        this.client.send(packet);
    }

    getClient() {
        return this.client;
    }

    getName() {
        return this.name;
    }

}

module.exports = User;