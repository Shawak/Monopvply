(function () {

    for (var prop in window.exports) {
        window[prop] = window.exports[prop];
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
            }
        );
        stage.hide(true);

        var iterations = 0;

        var gameMap;
        var generalMenu;
        var queue = new QueueManager();

        var testFunc = function () {
            if (iterations == 0)
                queue.add(user.buyCard.bind(user, 0));
            if (iterations == 1)
                queue.add(user.buyCard.bind(user, 2));
            if (iterations == 2)
                queue.add(user.buyCard.bind(user, 4));
            if (iterations == 3)
                queue.add(user.buyCard.bind(user, 5));
            if (iterations == 4)
                queue.add(user.buyCard.bind(user, 7));
            if (iterations == 5)
                queue.add(user.buyCard.bind(user, 8));
            if (iterations == 6)
                queue.add(user.moveTo.bind(user, 6));

            iterations++;
            if (iterations < 9)
                setTimeout(testFunc, 100);
        };

        function startRendering() {
            gameMap = new Map(stage);
            window.ingameMenu = new Menu(stage, queue);
            generalMenu = new Menu(stage, queue);
			var informationMenu=new Menu(stage,queue);
			
            window.user = new Player(gameMap, ingameMenu.getLayer(),informationMenu, 1500, "./img/test.jpg", "./img/test.jpg");
            var enemies = [];
            enemies.push(new Player(gameMap, ingameMenu.getLayer(),informationMenu, 1500, "./img/Testing.jpg", "./img/Testing.jpg"));
            enemies.push(new Player(gameMap, ingameMenu.getLayer(),informationMenu, 1500, "./img/Testing.jpg", "./img/Testing.jpg"));
            enemies.push(new Player(gameMap, ingameMenu.getLayer(),informationMenu, 1500, "./img/Testing.jpg", "./img/Testing.jpg"));

            var houseBuildingMenu = houseBuildingWindow.bind(null, generalMenu, gameMap, 5, user, "Accept", "Cancel");

			setUpStandardMenu(ingameMenu,gameMap,user,enemies,houseBuildingMenu);
			setUpStandardMap(queue,gameMap,informationMenu);

            user.addBoardFigure("", "green");
            queue.start();
            setTimeout(testFunc, 3000);
        }
    }

    function login() {
        client.send(new LoginPacket('User', ''));
    }

    function onPingPacket(sender, packet) {
        console.log(new Date().getTime() - packet.sent)
    }

    function onGameStartPacket(sender, packet) {
        page('game', function() {
            startGame();
        });
    }

    function page(pageName, callback) {
        $.ajax({
            url: '/' + pageName + '.html'
        }).done(function (data) {
            $('#content').html(data);
            if(pageName == 'game') {
                startGame();
            }
            if(callback) {
                callback();
            }
        });
    }

    function onNextTurnPacket(sender, packet) {
        // TODO
        // update gui buttons (disable them)
    }

    function onUpdatePlayerPacket(sender, packet) {
        // TODO
        // update player

        // if (packet.player.position != player.position)
        // call movement animations
    }

    function onUpdateFieldPacket(sender, packet) {
        // TODO
        // update field
    }

    function onChatMessagePacket(sender, packet) {
        // TODO
        // display chat message
        // packet.from is null on server broadcasts
    }

    function onDiceResultPacket(sender, packet) {
        // TODO
    }

    function sendMessage(message) {
        client.send(new ChatMessagePacket(null, message));
    }

    var client = new Client();
    client.network.link(PingPacket, onPingPacket);
    client.network.link(GameStartPacket, onGameStartPacket);
    client.network.link(NextTurnPacket, onNextTurnPacket);
    client.network.link(UpdatePlayerPacket, onUpdatePlayerPacket);
    client.network.link(UpdateFieldPacket, onUpdateFieldPacket);
    client.network.link(ChatMessagePacket, onChatMessagePacket);
    client.network.link(DiceResultPacket, onDiceResultPacket);
    client.start();

    page('lobbies');

    window.page = page;
    window.login = login;
})();
