const Player = require('./../player.js');
const Field = require('./../field.js');
const Street = require('./../street.js');

class TaxField extends Field {
    constructor(id, name, img, textColor, price) {
        super(id, name, img);
        this.textColor = textColor;
        this.price = price;
    }

    onEnter(game, player) {
        player.money -= this.price;
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
                player.money += 1;
                game.update(player);
            }),
            new Street(id++, 'Metin2', 'img/streets/7_major_3/2_metin_2.jpg', 0, 'brown', 120),
            new CommunityField(id++, 'img/events/2_community.jpg'),
            new Street(id++, 'Flyff', 'img/streets/7_major_3/1_flyff.jpg', 0, 'brown', 140),
            new TaxField(id++, 'Pay your tax!', 'img/events/3_tax.jpg', '#ff471a', 400),
            new Street(id++, 'John Dread', 'img/stations/1_john_dread.jpg', 10, 'red', 400),
            new Street(id++, 'Nostale', 'img/streets/2_mmorpg/1_nostale.jpg', 1, 'lightblue', 200),
            new ActionField(id++, 'img/events/1_action.jpg'),
            new Street(id++, 'Last Chaos', 'img/streets/2_mmorpg/2_last_chaos.jpg', 1, 'lightblue', 200),
            new Street(id++, 'Tera', 'img/streets/2_mmorpg/3_tera.jpg', 1, 'lightblue', 'Tera', 240),

            new Field(id++, 'Prison', 'img/corner/2_prison.jpg'),
            new Street(id++, 'General Gaming', 'img/streets/1_gaming/1_general_gaming.jpg', 2, 'pink', 240),
            new TaxField(id++, 'Pay more taxes!', 'img/events/3_tax.jpg', '#ff471a', 300),
            new Street(id++, 'Console Games', 'img/streets/1_gaming/2_consoles.jpg', 2, 'pink', 280),
            new Street(id++, 'Browser Games', 'img/streets/1_gaming/3_browser_games.jpg', 2, 'pink', 320),
            new Street(id++, 'Luke', 'img/stations/2_luke.jpg', 10, 'red', 400),
            new Street(id++, 'Battlefield', 'img/streets/3_shooter/1_battlefield.jpg', 3, 'orange', 240),
            new CommunityField(id++, 'img/events/2_community.jpg'),
            new Street(id++, 'Counter Strike', 'img/streets/3_shooter/2_counter_strike.jpg', 3, 'orange', 'Counter Strike', 360),
            new Street(id++, 'Arma', 'img/streets/3_shooter/3_arma.jpg', 3, 'orange', 'Arma', 400),

            new Field(id++, 'Cash Out', 'img/corner/3_cash_out.jpg'),
            new Street(id++, 'Joining Epvp', 'img/streets/6_general/1_joining_epvp.jpg', 4, 'red', 440),
            new ActionField(id++, 'img/events/1_action.jpg'),
            new Street(id++, 'Complaint Area', 'img/streets/6_general/2_complaint_area.jpg', 4, 'red', 440),
            new Street(id++, 'Black Market Support', 'img/streets/6_general/3_the_black_market_support.jpg', 4, 'red', 480),
            new Street(id++, 'MrSm!th', 'img/stations/3_smith.jpg', 10, 'red', 400),
            new Street(id++, 'World of Warcraft', 'img/streets/4_major_1/1_wow.jpg', 5, 'yellow', 520),
            new Street(id++, 'Diablo 3', 'img/streets/4_major_1/2_diablo_3.jpg', 5, 'yellow', 520),
            new TaxField(id++, 'Taxes! Taxes! Taxes!', 'img/events/3_tax.jpg', '#ff471a', 300),
            new Street(id++, 'League of Legends', 'img/streets/4_major_1/3_lol.jpg', 5, 'yellow', 560),

            new Field(id++, 'Busted!', 'img/corner/4_go_to_prison.jpg'),
            new Street(id++, 'Guild Wars 2', 'img/streets/5_major_2/1_guild_wars_2.jpg', 6, 'green', 600),
            new CommunityField(id++, 'img/events/2_community.jpg'),
            new Street(id++, 'Aion', 'img/streets/5_major_2/2_aion.jpg', 6, 'green', 600),
            new Street(id++, 'Star Wars: The Old Republic', 'img/streets/5_major_2/3_swtor.jpg', 6, 'green', 640),
            new Street(id++, 'Muddy Waters', 'img/stations/4_muddy_waters.jpg', 10, 'red', 400),
            new ActionField(id++, 'img/events/1_action.jpg'),
            new Street(id++, 'Conquer Online', 'img/streets/8_major_4/1_conquer_online.jpg', 7, 'purple', 700),
            new TaxField(id++, 'Taxing!', 'img/events/3_tax.jpg', '#ff471a', 200),
            new Street(id++, 'Silkroad', 'img/streets/8_major_4/2_silkroad_online.jpg', 7, 'purple', 800),
        ];
    }

    onStart(game) {

    }

    onTurn(game, player) {
        let rolls = [game.random(1, 6), game.random(1, 6)];
        game.sendDices(rolls);

        let steps = rolls[0] + rolls[1];
        player.position = (player.position + steps) % this.fields.length;
        game.update(player);

        let field = this.fields[player.position];
        if (field.onEnter) {
            field.onEnter(game, player);
        }
    }

    onBuy(game, player, fieldID) {
        let field = this.fields[fieldID];
        if (player.money < field.price) {
            game.msg('You don\'t have enough money to purchase this.', player);
            return;
        }

        if (field[fieldID].owner == player.id) {
            game.msg('You are already the owner.', player);
            return;
        }

        player.money -= field.price;
        game.update(player);
        field.owner = player;
        game.update(field);
    }

}

module.exports = Monopvply;