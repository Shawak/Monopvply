let Street = function(index) {
    // session data
    this.houses = 0;

    // db data
    // get the street by index
    this.price = 0;

    // EXAMPLE DATA BELOW
    this.price = 100 * index;
    let ex_names = [
        'General Gaming',
        'Consoles',
        'Browser Games',
        'Final Fantasy',
        'Nostale',
        'Last Chaos',
        'TERA',
        'Battlefield',
        'Counter Strike',
        'ArmA',
    ];

    index = (index >= ex_names.length) ? index - ex_names.length : index;
    this.name = ex_names[index];
};

module.exports = Street;