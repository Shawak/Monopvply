let User = function(name, meeple) {
    this.name = name;
    this.cash = 0;

    let meeples = [
        'Car',
        'Plane',
        'Shoe',
        'Bike',
    ];

    this.meeple = meeples[meeple];
};

module.exports = User;