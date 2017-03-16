function Player(user, money) {

    this.user = user;
    this.money = money;

    this.getUser = function() {
        return this.user;
    };

    this.getMoney = function() {
        return this.money;
    };

}

module.exports = Player;