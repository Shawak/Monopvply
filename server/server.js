const express = require('express'),
    app = express(),
    http = require('http'),
    io = require('socket.io');

const crypto = require('crypto');

const Packets = require('./../shared/packets.js');
const User = require('./../shared/user.js');

const Client = require('./client');

// Database
let db = {};

// Web Server
class WebServer {

    constructor() {
        this.server = http.createServer(app);

        app.use(express.static(__dirname + '/../public'));
        app.use('/shared', express.static(__dirname + '/../shared'));
        app.use('/socket-io', express.static(__dirname + '/../node_modules/socket.io-client/dist'));
    }

    start() {
        this.server.listen(80);
    }
}

new WebServer().start();

// Game Server
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

new GameServer().start();