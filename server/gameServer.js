const io = require('socket.io'),
    crypto = require('crypto');

const Client = require('./client');
const Game = require('./game');

class GameServer {

    constructor() {
        this.clients = [];
        this.server = io();
        this.server.on('connection', (socket) => {

            let id = 0;
            do {
                id = crypto.randomBytes(4).toString('hex');
            } while (this.clients.find((client) => client.id != id));

            let client = new Client(id, socket);
            this.clients.push(client);
            console.log('client ' + id + ' has connected!');

            socket.on('disconnect', () => {
                let client = this.clients.find((client) => client.socket == socket);
                let index = this.clients.indexOf(client);
                this.clients.splice(index, 1);
                console.log('client ' + client.id + ' has disconnected!');
            });

        });
    }

    start() {
        this.server.listen(1234);
    }

    broadcast(packet) {
        this.clients.forEach((client) => {
            client.send(packet);
        });
    }
}

module.exports = GameServer;