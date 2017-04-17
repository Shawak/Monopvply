var PacketManager = {

    lookup: {},
    aid: 0,

    initialize: function(t) {
        for(var key in t) {
            this.add(t[key]);
        }
    },

    add: function (T) {
        this.lookup[this.aid++] = T.prototype;
    },

    pack: function (packet) {
        var type = Object.getPrototypeOf(packet);
        var id = -1;
        for(var i = 0; i < this.aid; i++) {
            if(this.lookup[i] == type) {
                id = i;
                break;
            }
        }
        return JSON.stringify({
            id: id,
            data: packet
        });
    },

    parse: function (data) {
        var parsed = JSON.parse(data);
        var id = parsed.id;
        var packet = Object.create(this.lookup[id]);
        for (var prop in parsed.data) {
            packet[prop] = parsed.data[prop];
        }
        return packet;
    }

};

module.exports = PacketManager;