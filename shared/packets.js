var PacketManager = {

    lookup: {},
    aid: 0,

    add: function (T) {
        var type = Object.getPrototypeOf(new T());
        this.lookup[this.aid++] = type;
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

exports.PacketManager = PacketManager;


function LoginPacket(username, password) {
    this.username = username;
    this.password = password;
    return this;
}
PacketManager.add(LoginPacket);
exports.LoginPacket = LoginPacket;

function PingPacket() {
    this.sent = new Date().getTime();
    return this;
}
PacketManager.add(PingPacket);
exports.PingPacket = PingPacket;

function GameStartPacket() {
    return this;
}
PacketManager.add(GameStartPacket);
exports.GameStartPacket = GameStartPacket;

function NextTurnPacket(player, turnTime) {
    this.player = player;
    this.turnTime = turnTime;
    return this;
}
PacketManager.add(NextTurnPacket);
exports.NextTurnPacket = NextTurnPacket;

function PlayerEndTurnPacket() {
    return this;
}
PacketManager.add(PlayerEndTurnPacket);
exports.PlayerEndTurnPacket = PlayerEndTurnPacket;