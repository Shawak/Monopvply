const express = require('express'),
    app = express(),
    http = require('http'),
    net = require('net');

const packets = require('./../shared/packets.js');
const User = require('./../shared/user.js');

const Client = require('./client');

// Database
let db = {

};

// Web Server
class WebServer {

    constructor() {
        this.server = http.createServer(app);

        app.use(express.static(__dirname + '/../public'));
        app.use(express.static(__dirname + '/../shared'));
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
        this.server = net.createServer((socket) => {

            console.log('client #' + this.clients.length + ' has connected!');
            let client = new Client(socket);
            this.clients.push(client);

            socket.on('data', (data) => {
                client.onData(data);
            });

            socket.on('end', () => {
                let client = this.clients.find((client) => client.socket == socket);
                let index = this.clients.indexOf(client);
                this.clients.splice(index, 1);
                console.log('client #' + index + ' has disconnected!');
            });


        });
    }

    start() {
        this.server.listen(1234);
    }

    broadcast(data) {
        this.clients.forEach((client) => {
            client.send(data);
        });
    }
}

new GameServer().start();