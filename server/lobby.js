const Packets = require('../shared/packets.js');

class Lobby {

    constructor(server, id, name, owner) {
        this.server = server;
        this.id = id;
        this.name = name;
        this.clients = [owner];
    }

    getClientsCount() {
        return this.clients.length;
    }

    getClients() {
        return this.clients;
    }

    join(client) {
        this.clients.push(client);
        client.network.link(Packets.ChatMessagePacket, this.onChatMessagePacket, this);
        client.network.link(Packets.LeaveLobbyPacket, this.onLeaveLobbyPacket, this);
    }

    leave(client) {
        this.clients.splice(this.clients.indexOf(client), 1);
        client.network.unlink(Packets.ChatMessagePacket, this.onChatMessagePacket, this);
        client.network.unlink(Packets.LeaveLobbyPacket, this.onLeaveLobbyPacket, this);
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