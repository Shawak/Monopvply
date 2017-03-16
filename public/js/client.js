function Client() {

    var self = this;

    this.start = function() {
        this.socket = io('localhost:1234');

        this.socket.on('connect', function () {
            console.log('connect');
            self.sendPacket(new loginPacket('Shawak', 'test'));
        });

        this.socket.on('packet', function (data) {
            console.log(data);
        });

        this.socket.on('disconnect', function () {
            console.log('disconnect');
        });
    };

    this.sendPacket = function(packet) {
        this.socket.emit('packet', packetManager.pack(packet));
    };

}

(function () {

    for(var prop in window.exports) {
        window[prop] = window.exports[prop];
    }

    new Client().start();

})();