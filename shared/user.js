function User(name) {

    this.name = name;

    this.getName = function() {
        return this.name;
    }
}

module.exports = User;