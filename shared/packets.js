var packetManager = {
    
    lookup: {},
    aid: 0,
    
    add: function(T) {
        this.lookup[this.aid++] = Object.getPrototypeOf(new T({}));
    },
    
    pack: function (packet) {
        return JSON.stringify({
            id: 0,
            data: packet
        });
    },

    parse: function(data) {
        var parsed = JSON.parse(data);
        var id = parsed.id;
        var o = Object.create(this.lookup[id]);
        for(var prop in parsed.data) {
            o[prop] = parsed.data[prop];
        }
        return o;
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