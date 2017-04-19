const Field = require('./field.js');

class Street extends Field {

    constructor(id, name, img, group, color, price, textColor=undefined) {
        super(id, name, img);

        this.group = group;
        this.color = color;
        this.price = price;
		this.textColor = textColor;

        this.owner = null;
        this.houses = null;
    }

}

module.exports = Street;