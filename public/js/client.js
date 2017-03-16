function Client() {

    var self = this;

    this.socket = io('localhost:1234');
    window.socket = this.socket;

    this.socket.on('connect', function () {
        console.log('connect');
        var packet = new window.exports.loginPacket('Shawak', 'test');
        console.log(packet);
        self.sendPacket(packet);
    });

    this.socket.on('packet', function (data) {
        console.log(data);
    });

    this.socket.on('disconnect', function () {
        console.log('disconnect');
    });

    this.sendPacket = function(packet) {
        this.socket.emit('packet', window.exports.packetManager.pack(packet));
    };

}

(function () {

    new Client();

})();