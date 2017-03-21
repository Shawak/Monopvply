const Field = require('./field.js');

class Street extends Field {

    constructor(id, img, name, group, color, price) {
        super(id, img);

        this.name = name;
        this.group = group;
        this.color = color;
        this.price = price;

        this.owner = null;
        this.houses = null;
    }

}

module.exports = Street;