var PacketManager = {

    lookup: {},
    reserve : {},

    aid: 0,

    add: function (T) {
        var type = Object.getPrototypeOf(new T());
        var id= this.aid++;
        this.reserve[id] = type;
        this.lookup[type] = id;
    },

    pack: function (packet) {
        var type = Object.getPrototypeOf(packet);
        return JSON.stringify({
            id: this.lookup[type],
            data: packet
        });
    },

    parse: function (data) {
        var parsed = JSON.parse(data);
        var id = parsed.id;
        var packet = Object.create(this.reserve[id]);
        for (var prop in parsed.data) {
            packet[prop] = parsed.data[prop];
        }
        return packet;
    }

};

exports.PacketManager = PacketManager;


function LoginPacket(username, password) {
    this.username = username;
    this.password = password;
    return this;
}
PacketManager.add(LoginPacket);
exports.LoginPacket = LoginPacket;
