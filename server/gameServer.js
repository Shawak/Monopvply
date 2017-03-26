const io = require('socket.io');

const Client = require('./client.js');
const Lobby = require('./lobby.js');

class GameServer {

    constructor() {
        this.clients = [];
        this.lobbies = [];

        this.server = io();
        this.server.on('connection', (socket) => {

            let id = 0;
            while(this.client.find(lobby => lobby.id != id))
                id++;

            this.clients.push(new Client(this, id, socket));
            console.log('client #' + id + ' has connected!');

            socket.on('disconnect', () => {
                let client = this.clients.find(client => client.socket == socket);
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
        return this.lobbies.find(x => x.id == id);
    }

    createLobby(owner) {
        let id = 0;
        while(this.lobbies.find(x => x.id == id))
            id++;
        this.lobbies.push(new Lobby(this, id, 'new lobby', owner));
    }

    removeLobby(lobby) {
        this.lobbies.slice(this.lobbies.indexOf(lobby), 1);
    }

}

module.exports = GameServer;