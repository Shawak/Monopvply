function Street(name, price, img) {

    this.name = name;
    this.price = price;
    this.img = img;

    this.getName = function() {
        return this.name;
    };

    this.getPrice = function() {
        return this.price;
    };

    this.getImage = function() {
        return this.img;
    };

}

module.exports = Street;