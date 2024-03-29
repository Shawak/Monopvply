const io = require('socket.io');

const Client = require('./client.js');
const Lobby = require('./lobby.js');

class GameServer {

    constructor(db) {
        this.db = db;

        // create dev user
        this.db.User.findOne({
            where: {
                name: 'dev'
            }
        }).then(user => {
            if (!user) {
                this.db.User.create({
                    name: 'dev',
                    password: 'dev'
                });
            }
        });

        this.clients = [];
        this.lobbies = [];

        this.server = io();
        this.server.on('connection', (socket) => {

            let id = 0;
            while (this.clients.find(client => client.id == id))
                id++;

            this.clients.push(new Client(this, id, socket));
            console.log('client #' + id + ' has connected!');

            socket.on('disconnect', () => {
                let client = this.clients.find(client => client.socket == socket);
                client.onDisconnect.dispatch();
                this.clients.splice(this.clients.indexOf(client), 1);
                console.log('client #' + client.id + ' has disconnected!');
            });

        });
    }

    start() {
        this.server.listen(1234);
    }

    getLobbies() {
        return this.lobbies;
    }

    getLobby(id) {
        return this.lobbies.find(lobby => lobby.id == id);
    }

    createLobby() {
        let id = 0;
        while (this.lobbies.find(lobby => lobby.id == id))
            id++;
        let lobby = new Lobby(this, id, 'new lobby');
        this.lobbies.push(lobby);
        return lobby;
    }

    removeLobby(lobby) {
        this.lobbies.splice(this.lobbies.indexOf(lobby), 1);
    }

    isInLobby(client) {
        return this.lobbies.find(lobby => lobby.hasClient(client));
    }

}

module.exports = GameServer;