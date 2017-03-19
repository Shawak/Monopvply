const express = require('express'),
    app = express(),
    http = require('http');

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

module.exports = WebServer;