(function () {

    for (var prop in window.exports) {
        window[prop] = window.exports[prop];
    }

    var gameMap;
    var ingameMenu;
    var generalMenu;
    var diceMenu;
    var queue = new QueueManager();
    var user;
    var enemies;
    var dices;
    var client = new Client();
	var highPerformance=true;
	var afkIterations=0;
	var stopAfkCheck=true;
	var maxSecAfk=30;
	
    function endTurn() 
	{
		stopAfkCheck=true;
        client.send(new PlayerEndTurnPacket());
    }

    function buyFieldSend(fieldId) 
	{
        client.send(new PlayerBuyPacket(fieldId));
    }

	function getAndSendMessage()
	{
		sendMessage($("#btn-input").val());
		$("#btn-input").val("");
	}
	
    function startGame(packet) 
	{
		$(document).mousemove(function(e) {afkIterations=0;});
		$("#btn-chat").click(getAndSendMessage);
		
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

        function startRendering() {
            gameMap = new Map(stage);
			gameMap.setHighPerformanceMode(highPerformance);
            ingameMenu = new Menu(stage, queue);
			ingameMenu.setHighPerformanceMode(highPerformance);
            generalMenu = new Menu(stage, queue);
			generalMenu.setHighPerformanceMode(highPerformance);
            informationMenu = new Menu(stage, queue);
			informationMenu.setHighPerformanceMode(highPerformance);
            diceMenu = new Menu(stage, queue);
			diceMenu.setHighPerformanceMode(highPerformance);
            enemies = [];

            for (var i = 0; i < packet.players.length; i++) {
                if (packet.players[i].id == packet.yourPlayerID) {
                    user = new Player(packet.players[i].id, gameMap, ingameMenu.getLayer(), informationMenu, packet.players[i].money, packet.players[i].color, "./img/test.jpg", "./img/test.jpg");
                }
                else {
                    enemies.push(new Player(packet.players[i].id, gameMap, ingameMenu.getLayer(), informationMenu, packet.players[i].money, packet.players[i].color, "./img/Testing.jpg", "./img/Testing.jpg"));
                }
            }

            var houseBuildingMenu = houseBuildingWindow.bind(null, generalMenu, gameMap, 5, user, "Accept", "Cancel");

            var menuEntities = setUpStandardMenu(ingameMenu, diceMenu, generalMenu, gameMap, user, enemies, houseBuildingMenu, endTurn,buyFieldSend);
            setUpStandardMap(packet, queue, gameMap, informationMenu);

            dices = menuEntities.dices;

            user.setBuyButton(menuEntities.buyButton);

            queue.start();

            user.addBoardFigure("");

            for (var i = 0; i < enemies.length; i++) {
                enemies[i].createCardManager();
                enemies[i].addBoardFigure("");
            }
			
        }
    }

    function login() {
        var username = $('#inputUsername').val();
        var password = $('#inputPassword').val();
        client.send(new LoginPacket(username ? username : 'User', password));
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

            $('#updateLobbies').click(function () {
                client.send(new RequestLobbiesPacket());
            });

            $('#startLobby').click(function () {
                client.send(new StartLobbyPacket());
            });

            $('#lobbies tbody').on('click', 'tr', function (e) {
                if (!e) e = window.event;
                var target = e.currentTarget || e.target || e.srcElement;
                var text = target.firstElementChild.innerText || target.firstElementChild.textContent || target.firstElementChild.innerHTML;
                var index = text.substring(1);
                client.send(new JoinLobbyPacket(index));
            });

            if (callback) {
                callback();
            }
        });
    }

    function sendMessage(message) 
	{
		if (user!=undefined)
		{
			client.send(new ChatMessagePacket(null, message));
		}
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
            startGame(packet);
        });
    }

	
	function afkCheck()
	{
		if(stopAfkCheck==true)
		{
			return;
		}

		afkIterations++;
		if(afkIterations>=maxSecAfk)
		{
			afkIterations=0;
			//endTurn();
		}
		window.setTimeout(afkCheck,1000);
	}
	
    function onNextTurnPacket(sender, packet) {
        // TODO
        // update gui buttons (disable them)
        queue.add(nextTurnState.bind(null, packet, ingameMenu, user));
		
		if(packet.player.id==user.getId())
		{
			stopAfkCheck=false;
			afkCheck();
		}
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

        queue.add(updateFieldState.bind(null, packet, user, enemies));
    }

    function onChatMessagePacket(sender, packet) {
        // TODO
        // display chat message
        // packet.from is null on server broadcasts
		
		if(packet.from == null)
		{
			addChatMessage('<font color="red">'+"System"+"</font>", "", packet.message);
		}
		else
		{
			var imgSrc="";
			if(user.getId()==packet.from.id)
			{
				imgSrc=user.imgSrc;
			}
			
			for(var i=0;i<enemies.length;i++)
			{
				if(enemies[i].getId()==packet.from.id)
				{
					imgSrc=enemies[i].imgSrc;
				}
			}

			addChatMessage(packet.from.name, imgSrc, packet.message);
		}
    }

    function onDiceResultPacket(sender, packet) {
        // TODO
        queue.add(updateDiceState.bind(null, packet, diceMenu, dices, user, enemies));
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
        if (!lobby) {
            changePage('lobby', function () {
                var users = [];
                for (var i = 0; i < packet.users.length; i++) {
                    users.push(packet.users[i].name);
                }
                $('#lobby span').text(users.join(', '));
            });
        }
    }

    var lobby = null;


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
