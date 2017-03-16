const express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    net = require('net');

// WebServer
server.listen(80);

app.use(express.static(__dirname  + '/../public'));

net.createServer(function (socket) {

}).listen(1234);