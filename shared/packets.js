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

function PlayerBuyPacket(fieldID) {
    this.fieldID = fieldID;
}

function UpdateFieldPacket(field) {
    this.field = field;
}

function UpdatePlayerPacket(player) {
    this.player = player;
}

function ChatMessagePacket(from, message) {
    this.from = from;
    this.message = message;
}

function CreateLobbyPacket() {
}

function UpdateLobbyPacket(users) {
    this.users = users;
}

function JoinLobbyPacket(lobbyID) {
    this.lobbyID = lobbyID;
}

function LeaveLobbyPacket() {
}

exports.LoginPacket = LoginPacket;
exports.PingPacket = PingPacket;
exports.GameStartPacket = GameStartPacket;
exports.NextTurnPacket = NextTurnPacket;
exports.PlayerEndTurnPacket = PlayerEndTurnPacket;
exports.DiceResultPacket = DiceResultPacket;
exports.PlayerBuyPacket = PlayerBuyPacket;
exports.UpdatePlayerPacket = UpdatePlayerPacket;
exports.UpdateFieldPacket = UpdateFieldPacket;
exports.ChatMessagePacket = ChatMessagePacket;

exports.CreateLobbyPacket = CreateLobbyPacket;
exports.UpdateLobbyPacket = UpdateLobbyPacket;
exports.JoinLobbyPacket = JoinLobbyPacket;
exports.LeaveLobbyPacket = LeaveLobbyPacket;