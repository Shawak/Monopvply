const Packets = require('../shared/packets.js');

const User = require('./user.js');
const Player = require('./player.js');

class Lobby {

    constructor(owner) {
        this.users = [user];
    }

    join(user) {
        this.users.push(user);

        let network = user.getClient().network;
        network.link(Packets.ChatMessagePacket, this.onChatMessagePacket);
    }

    leave(user) {
        this.users.splice(this.users.indexOf(user), 1);
    }

    senderToUser(sender) {
        for(let user of this.users) {
            if(user.getClient() == sender) {
                return user;
            }
        }
        return null;
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

    broadcast(packet) {
        for(let user of this.users) {
            user.send(packet);
        }
    }

}