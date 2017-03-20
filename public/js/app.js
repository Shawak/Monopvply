(function () {

    for (var prop in window.exports) {
        window[prop] = window.exports[prop];
    }

    function onPingPacket(sender, packet) {
        console.log(new Date().getTime() - packet.sent)
    }

    function onGameStartPacket(sender, packet) {
        $.ajax({
            url: '/game.html'
        }).done(function (data) {
            /*$('body').html(data);
             startGame();*/
        });
    }

    function startGame() {
        document.getElementById("loading-img").addEventListener('load', startRendering)

        var width = window.innerWidth;
        var height = window.innerHeight;
        var stage = new Konva.Stage(
            {
                container: 'container',
                width: width,
                height: height
            });
        stage.hide(true);

        var iterations = 0;

        var testFunc = function () {
            if (iterations == 0)
                user.buyCard(0);
            if (iterations == 1)
                user.buyCard(2);
            if (iterations == 2)
                user.buyCard(4);
            if (iterations == 3)
                user.buyCard(5);
            if (iterations == 4)
                user.moveTo(6);
            if (iterations == 5)
                acceptWindow(generalMenu, "Do you really want to buy Nostale (lightblue) for 100eg?", undefined, undefined);

            iterations++;
            if (iterations < 6)
                setTimeout(testFunc, 1000);
        };

        function startRendering() {
            window.gameMap = new Map(stage);
            window.ingameMenu = new Menu(stage);
            window.generalMenu = new Menu(stage);

            window.user = new Player(gameMap, ingameMenu.getLayer(), 1500, "./img/test.jpg", "./img/test.jpg");
            var enemies = [];
            enemies.push(new Player(gameMap, ingameMenu.getLayer(), 1500, "./img/Testing.jpg", "./img/Testing.jpg"));
            enemies.push(new Player(gameMap, ingameMenu.getLayer(), 1500, "./img/Testing.jpg", "./img/Testing.jpg"));
            enemies.push(new Player(gameMap, ingameMenu.getLayer(), 1500, "./img/Testing.jpg", "./img/Testing.jpg"));


            setUpStandardMenu(ingameMenu, gameMap, user, enemies);
            setUpStandardMap(gameMap);

            user.addBoardFigure("", "green");

            setTimeout(testFunc, 2000);
        }
    }

    var client = new Client();
    client.network.link(PingPacket, onPingPacket);
    client.network.link(GameStartPacket, onGameStartPacket);
    client.start();

})();