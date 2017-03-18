var packetManager = {

    lookup: {},
    aid: 0,

    add: function(T) {
        this.lookup[this.aid++] = [T, Object.getPrototypeOf(new T())];
    },

    pack: function (packet) {
        var id = 0;
        var type = Object.getPrototypeOf(packet);
        for(var i = 0; i < lookup.length; i++) {
            if(this.lookup[i][1] == type) {
                id = i;
                break;
	    }
	}
        return JSON.stringify({
            id: id,
            data: packet
        });
    },

    parse: function(data) {
        var parsed = JSON.parse(data);
        var id = parsed.id;
        var o = Object.create(this.lookup[id][1]);
        for(var prop in parsed.data) {
            o[prop] = parsed.data[prop];
        }
        return {
            type: this.lookup[id][0],
            packet: o
        };
    }

};

exports.packetManager = packetManager;


function loginPacket(username, password) {
    this.username = username;
    this.password = password;
    return this;
}
packetManager.add(loginPacket);
exports.loginPacket = loginPacket;
