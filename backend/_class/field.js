let Street = require('./field/street.js');

let Field = function(index, streetIndex) {
    this.isStreet = (index % 2 === 0);
    this.street = null;

    if (this.isStreet) {
        this.street = new Street(streetIndex);
    } else {

    }
};

module.exports = Field;