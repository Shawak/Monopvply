const Field = require('./field.js');

class Street extends Field {

    constructor(id, name, img, group, color, price, priceHouse, priceHotel) {
        super(id, name, img);

        this.group = group;
        this.color = color;
        this.price = price;
        this.priceHouse = priceHouse;
        this.priceHotel = priceHotel;

        this.mortgaged = false;
        this.owner = null;
        this.houses = null;
    }

}

module.exports = Street;