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

function StartLobbyPacket() {
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
exports.StartLobbyPacket = StartLobbyPacket;
exports.UpdateLobbyPacket = UpdateLobbyPacket;
exports.JoinLobbyPacket = JoinLobbyPacket;
exports.LeaveLobbyPacket = LeaveLobbyPacket;
exports.RequestLobbiesPacket = RequestLobbiesPacket;
exports.ListLobbiesPacket = ListLobbiesPacket;


/* Trade */

function TradeOfferPacket(from, offer /*{money, streets (array)}*/, to, receive /*{money, streets (array)}*/) {
    this.tradeID = null; // set by server
    this.from = from;
    this.offer = offer;
    this.to = to;
    this.receive = receive;

    // fix compiler warnings
    if(!this.offer) {
        this.offer = {};
    }
    if (!this.offer.receive) {
        this.offer.receive = [];
    }
    if (!this.offer.streets) {
        this.offer.streets = [];
    }
}

function TradeAnswerPacket(tradeID, accept) {
    this.tradeID = tradeID;
    this.accept = accept;
}

exports.TradeOfferPacket = TradeOfferPacket;
exports.TradeAnswerPacket = TradeAnswerPacket;


/* Other */

function PingPacket() {
    this.sent = new Date().getTime();
}

function GameStartPacket(players, field, yourPlayerID) {
    this.players = players;
    this.field = field;
    this.yourPlayerID = yourPlayerID;
}

function NextTurnPacket(player, turnTime, timestamp) {
    this.player = player;
    this.turnTime = turnTime;
    this.timestamp = timestamp;
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

/* house contains to house to build (eg 1-5 [5=hotel])
   so for example a three stands for three houses to build
   but a four would only build one house if there are already
   four houses on the field
 */
function PlayerBuildPacket(fieldID, house) {
    this.fieldID = fieldID;
    this.house = house;
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

function PlayerMortgagePacket(fieldID) {
    this.fieldID = fieldID;
}

function PlayerUnmortgagePacket(fieldID) {
    this.fieldID = fieldID;
}

function PlayerJailPacket(buyFree) {
    this.buyFree = buyFree;
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
exports.PlayerMortgagePacket = PlayerMortgagePacket;
exports.PlayerUnmortgagePacket = PlayerUnmortgagePacket;
exports.PlayerBuildPacket = PlayerBuildPacket;
exports.PlayerJailPacket = PlayerJailPacket;