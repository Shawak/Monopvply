const Packets = require('../shared/packets.js');

class Lobby {

    constructor(server, id, name) {
        this.server = server;
        this.id = id;
        this.name = name;
        this.clients = [];
    }

    getClientCount() {
        return this.clients.length;
    }

    getClients() {
        return this.clients;
    }

    hasClient(client) {
        return this.clients.find(x => x == client);
    }

    join(client) {
        this.clients.push(client);
        client.onDisconnect.add(this.onClientDisconnect);
        client.network.link(Packets.ChatMessagePacket, this.onChatMessagePacket, this);
        client.network.link(Packets.LeaveLobbyPacket, this.onLeaveLobbyPacket, this);
        client.send(new Packets.UpdateLobbyPacket(this.getClients()));
    }

    leave(client) {
        this.clients.splice(this.clients.indexOf(client), 1);
        client.onDisconnect.remove(this.onClientDisconnect);
        client.network.unlink(Packets.ChatMessagePacket, this.onChatMessagePacket, this);
        client.network.unlink(Packets.LeaveLobbyPacket, this.onLeaveLobbyPacket, this);
    }

    onClientDisconnect(sender) {
        this.leave(sender);
    }

    getOwner() {
        return this.clients[0];
    }

    isOwner(client) {
        return this.clients[0] == client;
    }

    onChatMessagePacket(sender, packet) {
        this.broadcast(packet);
    }

    onLeaveLobbyPacket(sender, packet) {
        this.clients.splice(this.clients.indexOf(sender), 1);
        if(this.clients.length == 0) {
            this.server.removeLobby(this);
        }
    }

    broadcast(packet) {
        for(let client of this.clients) {
            client.send(packet);
        }
    }

}

module.exports = Lobby;