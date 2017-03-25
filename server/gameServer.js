const io = require('socket.io'),
    crypto = require('crypto');

const Client = require('./client.js');
const Lobby = require('./lobby.js');

class GameServer {

    constructor() {
        this.clients = [];
        this.lobbies = [];

        this.server = io();
        this.server.on('connection', (socket) => {

            let id = 0;
            do {
                id = crypto.randomBytes(4).toString('hex');
            } while (this.clients.find(client => client.id != id));

            let client = new Client(this, id, socket);
            this.clients.push(client);
            console.log('client ' + id + ' has connected!');

            socket.on('disconnect', () => {
                let client = this.clients.find(client => client.socket == socket);
                let index = this.clients.indexOf(client);
                this.clients.splice(index, 1);
                console.log('client ' + client.id + ' has disconnected!');
            });

        });
    }

    start() {
        this.server.listen(1234);
    }

    sendLobbiesPacket(client) {
        let lobbies = [];
        for(let lobby of this.lobbies) {
            lobbies.push({
                id: lobby.id,
                name: lobby.name
            });
        }
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