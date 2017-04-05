(function () {

    for (var prop in window.exports) {
        window[prop] = window.exports[prop];
    }

    var gameMap;
    var ingameMenu;
    var generalMenu;
    var queue = new QueueManager();
    var user;
    var enemies = [];

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
            if (iterations == 7)
                queue.add(user.moveTo.bind(user, 2));

            iterations++;
            if (iterations < 9)
                setTimeout(testFunc, 100);
        };

        function startRendering() {
            gameMap = new Map(stage);
            ingameMenu = new Menu(stage, queue);
            generalMenu = new Menu(stage, queue);
            informationMenu = new Menu(stage, queue);

            user = new Player(0, gameMap, ingameMenu.getLayer(), informationMenu, 1500, "red", "./img/test.jpg", "./img/test.jpg");
            enemies = [];
            enemies.push(new Player(1, gameMap, ingameMenu.getLayer(), informationMenu, 1500, "green", "./img/Testing.jpg", "./img/Testing.jpg"));
            enemies.push(new Player(2, gameMap, ingameMenu.getLayer(), informationMenu, 1500, "yellow", "./img/Testing.jpg", "./img/Testing.jpg"));
            enemies.push(new Player(3, gameMap, ingameMenu.getLayer(), informationMenu, 1500, "blue", "./img/Testing.jpg", "./img/Testing.jpg"));

            var houseBuildingMenu = houseBuildingWindow.bind(null, generalMenu, gameMap, 5, user, "Accept", "Cancel");

            setUpStandardMenu(ingameMenu, generalMenu, gameMap, user, enemies, houseBuildingMenu);
            setUpStandardMap(queue, gameMap, informationMenu);

            user.addBoardFigure("");
            queue.start();

            for (var i = 0; i < enemies.length; i++) {
                enemies[i].createCardManager();
                enemies[i].addCard(11);
            }

            setTimeout(testFunc, 4000);
        }
    }

    function login() {
        client.send(new LoginPacket('User', ''));
    }

    function changePage(pageName, callback) {
        $('#navbar li').removeClass('active');
        $('#navbar a[href="#' + pageName + '"]').parent().addClass('active');
        $.ajax({
            url: '/' + pageName + '.html'
        }).done(function (data) {
            $('#navbar [href="#' + pageName + '"]').addClass('active');
            $('#content').html(data);

            $('#createLobby').click(function () {
                client.send(new CreateLobbyPacket());
            });

            $('#startLobby').click(function () {
                client.send(new StartLobbyPacket());
            });

            $('#lobbies tbody').on('click', 'tr', function (e) {
                var index = e.currentTarget.firstElementChild.innerText.substring(1);
                client.send(new JoinLobbyPacket(index));
            });

            if (callback) {
                callback();
            }
        });
    }

    function sendMessage(message) {
        client.send(new ChatMessagePacket(null, message));
    }

    function onLoginResultPacket(sender, packet) {
        if (packet.success) {
            $('#navbar a[href="#login"]').remove();
            $('#navbar .nav').append('<li><a href="#lobbies">Lobbies</a></li>');
            client.send(new RequestLobbiesPacket());
        }
    }

    function onPingPacket(sender, packet) {
        console.log(new Date().getTime() - packet.sent)
    }

    function onGameStartPacket(sender, packet) {
        changePage('game', function () {
            startGame();
        });
    }

    function onNextTurnPacket(sender, packet) {
        // TODO
        // update gui buttons (disable them)

        queue.add(nextTurnState.bind(null, packet, user));
    }

    function onUpdatePlayerPacket(sender, packet) {
        // TODO
        // update player

        // if (packet.player.position != player.position)
        // call movement animations

        queue.add(updatePlayerState.bind(null, packet, user, enemies));
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

    function onListLobbiesPacket(sender, packet) {
        changePage('lobbies', function () {
            var elem = $('#lobbies tbody');
            elem.empty();
            for (var i = 0; i < packet.lobbies.length; i++) {
                elem.append('<tr>' +
                    '<td>#' + packet.lobbies[i].id + '</td>' +
                    '<td>' + packet.lobbies[i].name + '</td>' +
                    '<td>' + packet.lobbies[i].clients + '</td>' +
                    '</tr>')
            }
        });
    }

    function onUpdateLobbyPacket(sender, packet) {
        console.log(packet);
        if (!lobby) {
            changePage('lobby', function () {

            });
        }
    }

    var lobby = null;

    var client = new Client();
    client.network.link(LoginResultPacket, onLoginResultPacket, this);
    client.network.link(PingPacket, onPingPacket, this);
    client.network.link(GameStartPacket, onGameStartPacket, this);
    client.network.link(NextTurnPacket, onNextTurnPacket, this);
    client.network.link(UpdatePlayerPacket, onUpdatePlayerPacket, this);
    client.network.link(UpdateFieldPacket, onUpdateFieldPacket, this);
    client.network.link(ChatMessagePacket, onChatMessagePacket, this);
    client.network.link(DiceResultPacket, onDiceResultPacket, this);
    client.network.link(ListLobbiesPacket, onListLobbiesPacket, this);
    client.network.link(UpdateLobbyPacket, onUpdateLobbyPacket, this);
    client.start();

    window.changePage = changePage;
    window.login = login;

    changePage('login');

    $('#navbar a').click(function () {
        var page = $(this).attr('href').substring(1);
        changePage(page);
    });

})();
