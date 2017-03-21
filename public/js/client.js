function Client() {

    this.network = new EventHandler();

    var self = this;

    this.start = function () {
        var queue = [];
        var isDone = true;

        function dispatch() {
            if(isDone && queue.length > 0) {
                isDone = false;
                var data = queue.shift();
                try {
                    let packet = PacketManager.parse(data);
                    console.log(packet);
                    packet.done = function() { isDone = true; };
                    self.network.dispatch(self, packet);
                }
                catch (ex) {
                    console.log(ex);
                    isDone = true;
                }
            }
            setTimeout(function () {
                dispatch()
            }, 100);
        }

        setTimeout(function () {
            dispatch()
        }, 100);

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
        });

        this.socket.on('packet', function (data) {
            queue.push(data);
        });

        this.socket.on('error', function (e) {
            console.log(e);
        });

        this.socket.on('disconnect', function () {
            console.log('disconnect');
        });
    };

    this.send = function (packet) {
        this.socket.emit('packet', PacketManager.pack(packet));
    };

}
