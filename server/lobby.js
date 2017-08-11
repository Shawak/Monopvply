const Packets = require('../shared/packets.js');
const Game = require('./game.js');

class Lobby {

    constructor(server, id, name) {
        this.server = server;
        this.id = id;
        this.name = name;
        this.clients = [];
        this.game = null;
    }

    getClientsCount() {
        return this.clients.length;
    }

    getClients() {
        return this.clients;
    }

    getUsers() {
        let ret = [];
        for (let client of this.clients) {
            ret.push(client.user);
        }
        return ret;
    }

    hasClient(client) {
        return this.clients.find(client => client == client);
    }

    getOwner() {
        return this.clients[0];
    }

    isOwner(client) {
        return this.clients[0] == client;
    }

    join(client) {
        this.clients.push(client);
        client.onDisconnect.add(this.onClientDisconnect, this);
        client.network.link(Packets.StartLobbyPacket, this.onStartLobbyPacket, this);
        client.network.link(Packets.LeaveLobbyPacket, this.onLeaveLobbyPacket, this);
        this.broadcast(new Packets.UpdateLobbyPacket(this.getUsers()));
    }

    leave(client) {
        this.clients.splice(this.clients.indexOf(client), 1);
        client.onDisconnect.remove(this.onClientDisconnect, this);
        client.network.unlink(Packets.StartLobbyPacket, this.onStartLobbyPacket, this);
        client.network.unlink(Packets.LeaveLobbyPacket, this.onLeaveLobbyPacket, this);
        if (this.clients.length == 0) {
            this.server.removeLobby(this);
        }
    }

    onClientDisconnect(sender) {
        this.leave(sender);
    }

    onStartLobbyPacket(sender, packet) {
        if (sender == this.getOwner()) {
            this.game = new Game(this.clients);
            this.game.start();
        }
    }

    onLeaveLobbyPacket(sender, packet) {
        this.leave(sender);
    }

    broadcast(packet) {
        for (let client of this.clients) {
            client.send(packet);
        }
    }

}

module.exports = Lobby;