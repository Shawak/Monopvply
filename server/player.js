class Player {

    constructor(name, money) {
        this.name = name;
        this.money = money;
    }

    getName() {
        return this.name;
    }

    getMoney() {
        return this.money;
    }

}

module.exports = Player;