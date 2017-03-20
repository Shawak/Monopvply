function Client() {

    this.network = new EventHandler();

    var self = this;

    this.start = function () {
        this.socket = io(location.host + ':1234',
            {
                // using websocket for now because polling
                // sometimes freezes without any reason
                transports: ['websocket'],
                upgrade: false
            }
        );

        this.socket.on('connect', function () {
            console.log('connect');
            self.sendPacket(new LoginPacket('Shawak', 'test'));
        });

        this.socket.on('packet', function (data) {
            try {
                let packet = PacketManager.parse(data);
                console.log(packet);
                self.network.dispatch(self, packet);
            } catch (ex) {
                console.log(ex);
            }
        });

        this.socket.on('error', function (e) {
            console.log(e);
        });

        this.socket.on('disconnect', function () {
            console.log('disconnect');
        });
    };

    this.sendPacket = function (packet) {
        this.socket.emit('packet', PacketManager.pack(packet));
    };

}