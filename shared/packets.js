function LoginPacket(username, password) {
    this.username = username;
    this.password = password;
}

function PingPacket() {
    this.sent = new Date().getTime();
}

function GameStartPacket() {
}

function NextTurnPacket(player, turnTime) {
    this.player = player;
    this.turnTime = turnTime;
}

function PlayerEndTurnPacket() {
}

exports.LoginPacket = LoginPacket;
exports.PingPacket = PingPacket;
exports.GameStartPacket = GameStartPacket;
exports.NextTurnPacket = NextTurnPacket;
exports.PlayerEndTurnPacket = PlayerEndTurnPacket;