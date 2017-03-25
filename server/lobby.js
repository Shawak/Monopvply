const Packets = require('../shared/packets.js');

class Lobby {

    constructor(server, owner) {
        this.server = server;
        this.clients = [owner];
    }

    getClients() {
        return this.clients;
    }

    join(client) {
        this.clients.push(client);
        let network = client.network;
        network.link(Packets.ChatMessagePacket, this.onChatMessagePacket);
        network.link(Packets.LeaveLobbyPacket, this.onLeaveLobbyPacket);
    }

    leave(client) {
        this.users.splice(this.users.indexOf(client), 1);
        let network = client.network;
        network.unlink(Packets.ChatMessagePacket, this.onChatMessagePacket);
        network.unlink(Packets.LeaveLobbyPacket, this.onLeaveLobbyPacket);
    }

    getOwner() {
        return this.users[0];
    }

    isOwner(user) {
        return this.users[0] == user;
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