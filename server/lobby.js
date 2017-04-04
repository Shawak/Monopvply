const Packets = require('../shared/packets.js');

class Lobby {

    constructor(server, id, name) {
        this.server = server;
        this.id = id;
        this.name = name;
        this.clients = [];
    }

    getClientsCount() {
        return this.clients.length;
    }

    getClients() {
        return this.clients;
    }

    hasClient(client) {
        return this.clients.find(x => x == client);
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
        client.network.link(Packets.ChatMessagePacket, this.onChatMessagePacket, this);
        client.network.link(Packets.LeaveLobbyPacket, this.onLeaveLobbyPacket, this);
        client.send(new Packets.UpdateLobbyPacket([]));
    }

    leave(client) {
        this.clients.splice(this.clients.indexOf(client), 1);
        client.onDisconnect.remove(this.onClientDisconnect, this);
        client.network.unlink(Packets.ChatMessagePacket, this.onChatMessagePacket, this);
        client.network.unlink(Packets.LeaveLobbyPacket, this.onLeaveLobbyPacket, this);
        if(this.clients.length == 0) {
            this.server.removeLobby(this);
        }
    }

    onClientDisconnect(sender) {
        this.leave(sender);
    }

    onChatMessagePacket(sender, packet) {
        this.broadcast(packet);
    }

    onLeaveLobbyPacket(sender, packet) {
        this.leave(sender);
    }

    broadcast(packet) {
        for(let client of this.clients) {
            client.send(packet);
        }
    }

}

module.exports = Lobby;