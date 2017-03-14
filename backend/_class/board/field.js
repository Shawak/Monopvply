let Street = require('./field/street.js');
let Event = require('./field/event.js');

let Field = function(index) {
    this.type = null;

    if (index % 2 === 0) {
        this.type = new Street('Sunrise Avenue');
    } else {
        this.type = new Event('Go to prison!');
    }
};

module.exports = Field;