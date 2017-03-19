function Player(name, money) {

    this.name = name;
    this.money = money;

    this.getName = function() {
        return this.name;
    };

    this.getMoney = function() {
        return this.money;
    };

}

module.exports = Player;