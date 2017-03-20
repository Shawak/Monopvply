function setUpStandardMap(gameMap) {
    gameMap.addSideField(new Field(0, "./img/streets/7_major_3/2_metin_2.jpg", "brown", "Metin2", 120));
    gameMap.addSideField(new Field(1, "./img/events/2_community.jpg", "", "Community Field", "", 0));
    gameMap.addSideField(new Field(2, "./img/streets/7_major_3/1_flyff.jpg", "brown", "Flyff", 140));

    gameMap.addSideField(new Field(3, "./img/events/3_tax.jpg", "", "Pay your tax!", 400, undefined, "#ff471a"));

    gameMap.addSideField(new Field(4, "./img/stations/1_john_dread.jpg", "", "John Dread", 400, undefined, undefined, "red"));

    gameMap.addSideField(new Field(5, "./img/streets/2_mmorpg/1_nostale.jpg", "lightblue", "Nostale", 200));

    gameMap.addSideField(new Field(6, "./img/events/1_action.jpg", "", "Action field", 0));

    gameMap.addSideField(new Field(7, "./img/streets/2_mmorpg/2_last_chaos.jpg", "lightblue", "Last Chaos", 200));
    gameMap.addSideField(new Field(8, "./img/streets/2_mmorpg/3_tera.jpg", "lightblue", "Tera", 240));


    gameMap.addSideField(new Field(9, "./img/streets/1_gaming/1_general_gaming.jpg", "pink", "General Gaming", 240));

    gameMap.addSideField(new Field(10, "./img/events/3_tax.jpg", "", "Pay more taxes!", 300, undefined, "#ff471a"));

    gameMap.addSideField(new Field(11, "./img/streets/1_gaming/2_consoles.jpg", "pink", "Console Games", 280));
    gameMap.addSideField(new Field(12, "./img/streets/1_gaming/3_browser_games.jpg", "pink", "Browser Games", 320));

    gameMap.addSideField(new Field(13, "./img/stations/2_luke.jpg", "", "Luke", 400, undefined, undefined, "red"));

    gameMap.addSideField(new Field(14, "./img/streets/3_shooter/1_battlefield.jpg", "orange", "Battlefield", 240));
    gameMap.addSideField(new Field(15, "./img/events/2_community.jpg", "", "Community Field", 0));
    gameMap.addSideField(new Field(16, "./img/streets/3_shooter/2_counter_strike.jpg", "orange", "Counter Strike", 360));
    gameMap.addSideField(new Field(17, "./img/streets/3_shooter/3_arma.jpg", "orange", "Arma", 400));

    gameMap.addSideField(new Field(18, "./img/streets/6_general/1_joining_epvp.jpg", "red", "Joining Epvp", 440));
    gameMap.addSideField(new Field(19, "./img/events/1_action.jpg", "", "Action Field", 0));
    gameMap.addSideField(new Field(20, "./img/streets/6_general/2_complaint_area.jpg", "red", "Complaint Area", 440));
    gameMap.addSideField(new Field(21, "./img/streets/6_general/3_the_black_market_support.jpg", "red", "Black Market Support", 480));

    gameMap.addSideField(new Field(22, "./img/stations/3_smith.jpg", "", "MrSm!th", 400, undefined, undefined, "red"));

    gameMap.addSideField(new Field(23, "./img/streets/4_major_1/1_wow.jpg", "yellow", "World of Warcraft", 520));
    gameMap.addSideField(new Field(24, "./img/streets/4_major_1/2_diablo_3.jpg", "yellow", "Diablo 3", 520));

    gameMap.addSideField(new Field(25, "./img/events/3_tax.jpg", "", "Taxes! Taxes! Taxes!", 300, undefined, "#ff471a"));

    gameMap.addSideField(new Field(26, "./img/streets/4_major_1/3_lol.jpg", "yellow", "League of Legends", 560));

    gameMap.addSideField(new Field(27, "./img/streets/5_major_2/1_guild_wars_2.jpg", "green", "Guild Wars 2", 600));
    gameMap.addSideField(new Field(28, "./img/events/2_community.jpg", "", "Community Field", 0));
    gameMap.addSideField(new Field(29, "./img/streets/5_major_2/2_aion.jpg", "green", "Aion", 600));
    gameMap.addSideField(new Field(30, "./img/streets/5_major_2/3_swtor.jpg", "green", "Star Wars: The Old Republic", 640));

    gameMap.addSideField(new Field(31, "./img/stations/4_muddy_waters.jpg", "", "Muddy Waters", 400, undefined, undefined, "red"));

    gameMap.addSideField(new Field(32, "./img/events/1_action.jpg", "", "Action Field", 0));

    gameMap.addSideField(new Field(33, "./img/streets/8_major_4/1_conquer_online.jpg", "purple", "Conquer Online", 700));
    gameMap.addSideField(new Field(34, "./img/events/3_tax.jpg", "", "Taxing!", 200, undefined, "#ff471a"));
    gameMap.addSideField(new Field(35, "./img/streets/8_major_4/2_silkroad_online.jpg", "purple", "Silkroad", 800));

    gameMap.addCornerField(new Field(36, "./img/corner/1_start.jpg", "", "Start", 0, ""));
    gameMap.addCornerField(new Field(37, "./img/corner/2_prison.jpg", "", "Prisoner", 0, ""));
    gameMap.addCornerField(new Field(38, "./img/corner/3_cash_out.jpg", "", "Cash Out", 0, ""));
    gameMap.addCornerField(new Field(39, "./img/corner/4_go_to_prison.jpg", "", "Busted!", 0, ""));

    gameMap.setUp();
}