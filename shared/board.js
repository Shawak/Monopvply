function Board(fields) {

    this.fields = fields;

    this.getFields = function() {
        return this.fields;
    };

}

module.exports = Board;