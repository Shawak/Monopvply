function Client() {

    this.connection = new WebSocket('ws://localhost:1234');

    this.connection.onopen = function() {
        console.log('onopen');
    };

    this.connection.onerror = function(e) {
        console.log('onerror' + e);
    };

    this.connection.onmessage = function(e) {
        console.log('onmessage' + e);
    };

}

(function() {
    new Client();
})();