class Player {

    constructor(id, name, color) {
        this.id = id;
        this.name = name;
        this.color = color;

        this.money = 0;
        this.position = 0;
        this.jailed = false;
    }

}

module.exports = Player;