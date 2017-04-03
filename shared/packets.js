/* Login */

function LoginPacket(username, password) {
    this.username = username;
    this.password = password;
}

function LoginResultPacket(success) {
    this.success = success;
}

exports.LoginPacket = LoginPacket;
exports.LoginResultPacket = LoginResultPacket;


/* Lobby */

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

function ListLobbiesPacket(lobbies) {
    this.lobbies = lobbies;
}

function RequestLobbiesPacket() {
}

exports.CreateLobbyPacket = CreateLobbyPacket;
exports.UpdateLobbyPacket = UpdateLobbyPacket;
exports.JoinLobbyPacket = JoinLobbyPacket;
exports.LeaveLobbyPacket = LeaveLobbyPacket;
exports.RequestLobbiesPacket = RequestLobbiesPacket;
exports.ListLobbiesPacket = ListLobbiesPacket;


/* Other */

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
	// not needed!? --> UpdatePlayerPacket/UpdateFieldPacket is enough?!
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

exports.PingPacket = PingPacket;
exports.GameStartPacket = GameStartPacket;
exports.NextTurnPacket = NextTurnPacket;
exports.PlayerEndTurnPacket = PlayerEndTurnPacket;
exports.DiceResultPacket = DiceResultPacket;
exports.PlayerBuyPacket = PlayerBuyPacket;
exports.UpdatePlayerPacket = UpdatePlayerPacket;
exports.UpdateFieldPacket = UpdateFieldPacket;
exports.ChatMessagePacket = ChatMessagePacket;