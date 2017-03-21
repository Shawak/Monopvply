function LoginPacket(username, password) {
    this.username = username;
    this.password = password;
}

function PingPacket() {
    this.sent = new Date().getTime();
}

function GameStartPacket(players, field) {
    this.players = players;
    this.field = field;
}

function NextTurnPacket(player, turnTime) {
    this.player = player;
    this.turnTime = turnTime;
}

function PlayerEndTurnPacket() {
}

function DiceResultPacket(player, rollResult) {
    this.player = player;
    this.rollResult = rollResult;
}

function UpdatePlayersPacket(players) {
    this.players = players;
}

function PlayerBuyPacket(fieldID) {
    this.fieldID = fieldID;
}

exports.LoginPacket = LoginPacket;
exports.PingPacket = PingPacket;
exports.GameStartPacket = GameStartPacket;
exports.NextTurnPacket = NextTurnPacket;
exports.PlayerEndTurnPacket = PlayerEndTurnPacket;
exports.DiceResultPacket = DiceResultPacket;
exports.UpdatePlayersPacket = UpdatePlayersPacket;
exports.PlayerBuyPacket = PlayerBuyPacket;