const Player = require('./../player.js');
const Field = require('./../field.js');

class Street extends Field {
    constructor(id, name, img, group, color, price, priceHouse, priceHotel, rents) {
        super(id, name, img);

        this.group = group;
        this.color = color;
        this.price = price;
        this.priceHouse = priceHouse;
        this.priceHotel = priceHotel;
        this.rents = rents;

        this.mortgaged = false;
        this.owner = null;
        this.houses = 0;
    }

    onEnter(game, player) {
        if (this.owner != player) {
            player.money -= this.rents[this.houses == null ? 0 : this.houses];
            game.update(player);
        }
    }
}

class TaxField extends Field {
    constructor(id, name, img, textColor, price) {
        super(id, name, img);
        this.priceTextColor = textColor;
        this.tax = price;
    }

    onEnter(game, player) {
        player.tax -= this.tax;
        game.update(player);
    }
}

class ActionField extends Field {
    constructor(id, img) {
        super(id, 'Action Field', img);
    }

    onEnter(game, player) {

    }
}

class CommunityField extends Field {
    constructor(id, img) {
        super(id, 'Community Field', img);
    }

    onEnter(game, player) {

    }
}

class Station extends Street {
    constructor(id, name, img, group, textColor, price) {
        super(id, name, img, group, undefined, price, undefined, undefined, []);
        this.textColor = textColor;
    }

    onEnter(game, player) {
        let count = 0;
        for (let field of game.fields) {
            if (field instanceof Station && field.owner == this.owner) {
                count++;
            }
        }
        player.money -= Math.pow(2, count) * 25;
        game.update(player);
    }
}

class Monopvply {

    constructor(game, players) {
        this.game = game;
        this.players = players;

        for (let player of this.players) {
            player.money += 1500;
        }

        let id = 0;
        this.fields = [
            new Field(id++, 'Start', 'img/corner/1_start.jpg', (game, player) => {
                player.money += 400;
                game.update(player);
            }),
            new Street(id++, 'Metin2', 'img/streets/7_major_3/2_metin_2.jpg', 0, 'brown', 120, 50, 50, [2, 10, 30, 90, 160, 250]),
            new CommunityField(id++, 'img/events/2_community.jpg'),
            new Street(id++, 'Flyff', 'img/streets/7_major_3/1_flyff.jpg', 0, 'brown', 140, 50, 50, [4, 20, 60, 180, 320, 450]),
            new TaxField(id++, 'Pay your tax!', 'img/events/3_tax.jpg', '#ff471a', 400),
            new Station(id++, 'John Dread', 'img/stations/1_john_dread.jpg', 10, 'red', 400),
            new Street(id++, 'Nostale', 'img/streets/2_mmorpg/1_nostale.jpg', 1, 'lightblue', 200, 50, 50, [6, 30, 90, 270, 400, 550]),
            new ActionField(id++, 'img/events/1_action.jpg'),
            new Street(id++, 'Last Chaos', 'img/streets/2_mmorpg/2_last_chaos.jpg', 1, 'lightblue', 200, 50, 50, [6, 30, 90, 270, 400, 550]),
            new Street(id++, 'Tera', 'img/streets/2_mmorpg/3_tera.jpg', 1, 'lightblue', 240, 50, 50, 120, [8, 40, 100, 300, 450, 600]),

            new Field(id++, 'Prison', 'img/corner/2_prison.jpg'),
            new Street(id++, 'General Gaming', 'img/streets/1_gaming/1_general_gaming.jpg', 2, 'pink', 240, 100, 100, [10, 50, 150, 450, 625, 750]),
            new TaxField(id++, 'Pay more taxes!', 'img/events/3_tax.jpg', '#ff471a', 300),
            new Street(id++, 'Console Games', 'img/streets/1_gaming/2_consoles.jpg', 2, 'pink', 280, 100, 100, [10, 50, 150, 450, 625, 750]),
            new Street(id++, 'Browser Games', 'img/streets/1_gaming/3_browser_games.jpg', 2, 'pink', 320, 100, 100, [12, 60, 180, 500, 700, 900]),
            new Station(id++, 'Luke', 'img/stations/2_luke.jpg', 10, 'red', 400),
            new Street(id++, 'Battlefield', 'img/streets/3_shooter/1_battlefield.jpg', 3, 'orange', 240, 100, 100, [14, 70, 200, 550, 750, 950]),
            new CommunityField(id++, 'img/events/2_community.jpg'),
            new Street(id++, 'Counter Strike', 'img/streets/3_shooter/2_counter_strike.jpg', 3, 'orange', 360, 100, 100, [14, 70, 200, 550, 750, 950]),
            new Street(id++, 'Arma', 'img/streets/3_shooter/3_arma.jpg', 3, 'orange', 400, 200, 100, [16, 80, 220, 600, 800, 1000]),

            new Field(id++, 'Cash Out', 'img/corner/3_cash_out.jpg'),
            new Street(id++, 'Joining Epvp', 'img/streets/6_general/1_joining_epvp.jpg', 4, 'red', 440, 150, 150, [18, 90, 250, 700, 875, 1050]),
            new ActionField(id++, 'img/events/1_action.jpg'),
            new Street(id++, 'Complaint Area', 'img/streets/6_general/2_complaint_area.jpg', 4, 'red', 440, 150, 150, [18, 90, 250, 700, 875, 1050]),
            new Street(id++, 'Black Market Support', 'img/streets/6_general/3_the_black_market_support.jpg', 4, 'red', 480, 150, 150, [20, 100, 300, 750, 925, 1100]),
            new Station(id++, 'MrSm!th', 'img/stations/3_smith.jpg', 10, 'red', 400),
            new Street(id++, 'World of Warcraft', 'img/streets/4_major_1/1_wow.jpg', 5, 'yellow', 520, 150, 150, [22, 110, 330, 800, 975, 1150]),
            new Street(id++, 'Diablo 3', 'img/streets/4_major_1/2_diablo_3.jpg', 5, 'yellow', 520, 150, 150, [22, 110, 330, 800, 975, 1150]),
            new TaxField(id++, 'Taxes! Taxes! Taxes!', 'img/events/3_tax.jpg', '#ff471a', 300),
            new Street(id++, 'League of Legends', 'img/streets/4_major_1/3_lol.jpg', 5, 'yellow', 560, 150, 150, [24, 120, 360, 850, 1025, 1200]),

            new Field(id++, 'Busted!', 'img/corner/4_go_to_prison.jpg'),
            new Street(id++, 'Guild Wars 2', 'img/streets/5_major_2/1_guild_wars_2.jpg', 6, 'green', 600, 200, 200, [26, 130, 390, 900, 1100, 1275]),
            new CommunityField(id++, 'img/events/2_community.jpg'),
            new Street(id++, 'Aion', 'img/streets/5_major_2/2_aion.jpg', 6, 'green', 600, 200, 200, [26, 130, 390, 900, 1100, 1275]),
            new Street(id++, 'Star Wars: The Old Republic', 'img/streets/5_major_2/3_swtor.jpg', 6, 'green', 640, 200, 200, [28, 150, 450, 1000, 1200, 1400]),
            new Station(id++, 'Muddy Waters', 'img/stations/4_muddy_waters.jpg', 10, 'red', 400),
            new ActionField(id++, 'img/events/1_action.jpg'),
            new Street(id++, 'Conquer Online', 'img/streets/8_major_4/1_conquer_online.jpg', 7, 'purple', 700, 200, 200, [35, 175, 500, 1100, 1300, 1500]),
            new TaxField(id++, 'Taxing!', 'img/events/3_tax.jpg', '#ff471a', 200),
            new Street(id++, 'Silkroad', 'img/streets/8_major_4/2_silkroad_online.jpg', 7, 'purple', 800, 200, 200, [50, 200, 600, 1400, 1700, 2000]),
        ];
    }

    getPlayers() {
        return this.players;
    }

    getFields() {
        return this.fields;
    }

    onStart(game) {

    }

    onTurn(game, player) {
        let rolls = [game.random(1, 6), game.random(1, 6)];
        game.sendDices(rolls);

        let steps = rolls[0] + rolls[1];
        let lastPosition = player.position;
        player.position = (player.position + steps) % this.fields.length;
        if (lastPosition > player.position) {
            player.money += 200;
        }
        game.update(player);

        let field = this.fields[player.position];
        if (field.onEnter) {
            field.onEnter(game, player);
        }
    }

    onEndTurn(game, player) {
        if (player.money < 0) {
            // TODO eliminate player
        }
    }

    onBuy(game, player, fieldID) {
        let field = this.fields[fieldID];
        if (player.money < field.price) {
            game.msg('You don\'t have enough money to purchase this.', player);
            return;
        }

        if (field.owner == player.id) {
            game.msg('You are already the owner.', player);
            return;
        }

        if (field.owner != null) {
            game.msg('Someone already owns this field.', player);
            return;
        }

        if (!field.price) {
            game.msg('You can\'t buy this field.', player);
            return;
        }

        player.money -= field.price;
        game.update(player);
        field.owner = player;
        game.update(field);
    }

    onTrade(game, accept, from, offer, to, receive) {
        if (!accept) {
            game.msg(to.name + ' did not accept the trade.', from);
            return;
        }

        let tradeIsOkay = true;
        for (let id of offer.streets) {
            if (this.fields[id].owner != from) {
                tradeIsOkay = false;
                break;
            }
        }
        for (let id of receive.streets) {
            if (this.fields[id].owner != to) {
                tradeIsOkay = false;
                break;
            }
        }
        if (from.money < offer.money || to.money < receive.money) {
            tradeIsOkay = false;
        }

        if (!tradeIsOkay) {
            game.msg('This trade is not valid', from);
            console.log('invalid trade from player ' + from.name);
            return;
        }

        for (let id of offer.streets) {
            if (this.fields[id].owner == from) {
                this.fields[id].owner = to;
                game.update(this.fields[id]);
            }
        }

        for (let id of receive.streets) {
            if (this.fields[id].owner == to) {
                this.fields[id].owner = from;
                game.update(this.fields[id]);
            }
        }

        from.money -= offer.money;
        from.money += receive.money;
        game.update(from);

        to.money += offer.money;
        to.money -= receive.money;
        game.update(to);
    }

    onMortgage(game, player, fieldID) {
        let field = this.fields[fieldID];
        if (!field || (!field instanceof Street && !field instanceof Station)) {
            return;
        }

        if (field.mortgaged) {
            game.msg('This field is already mortgaged.', player);
            return;
        }

        player.money += Math.floor(field.price / 2);
        game.update(player);
        field.mortgaged = true;
        game.update(field);
    }

    onUnmortgage(game, player, fieldID) {
        let field = this.fields[fieldID];
        if (!field || (!field instanceof Street && !field instanceof Station)) {
            return;
        }

        if (!field.mortgaged) {
            game.msg('This field is not mortgaged.', player);
            return;
        }

        let cost = Math.floor((Math.floor(field.price / 2)) * 1.1);
        if (player.money < cost) {
            game.msg('You don\'t have enough money to unmortgage this field.', player);
            return;
        }

        player.money -= cost;
        game.update(player);
        field.mortgaged = false;
        game.update(field);
    }

    onBuild(game, player, fieldID, house) {
        let field = this.fields[fieldID];
        if (!field || !(house > 0 && house < field.rents) || field.houses >= house) {
            return;
        }

        for (let oField of this.fields)
            if (oField.group == field.group && oField.owner != field.owner) {
                game.msg('You need to own all streets of this type to build on it.', player);
                return;
            }

        let cost = 0;
        for (let i = field.houses; i < house; i++)
            cost += i < 5 ? field.priceHouse : field.priceHotel;

        if (player.money < cost) {
            game.msg('You don\'t have enough money to do this.', player);
            return;
        }

        player.money -= cost;
        game.update(player);
        field.houses = house;
        game.update(field);
    }

}

module.exports = Monopvply;