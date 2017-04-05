const Field = require('./field.js');

class Street extends Field {

    constructor(id, name, img, group, color, price) {
        super(id, name, img);

        this.group = group;
        this.color = color;
        this.price = price;

        this.owner = null;
        this.houses = null;
    }

}

module.exports = Street;