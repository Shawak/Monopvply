(function () {

    for (var prop in window.exports) {
        window[prop] = window.exports[prop];
    }

    function onPingPacket(sender, packet) {
        console.log(new Date().getTime() - packet.sent)
        packet.done();
    }

    function onGameStartPacket(sender, packet) {
        $.ajax({
            url: '/game.html'
        }).done(function (data) {
                $('body').html(data);
                startGame();
                packet.done();
            }
        );
    }

    function onNextTurnPacket(sender, packet) {
        packet.done();
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
		var ingameMenu;
		var generalMenu;
		var queue=new QueueManager();
		
        var testFunc = function () {
            if (iterations == 0)
				queue.add(user.buyCard.bind(user,0));
            if (iterations == 1)
                queue.add(user.buyCard.bind(user,2));
            if (iterations == 2)
                queue.add(user.buyCard.bind(user,4));
            if (iterations == 3)
                queue.add(user.buyCard.bind(user,5));
            if (iterations == 4)
               queue.add(user.buyCard.bind(user,7));
            if (iterations == 5)
                queue.add(user.buyCard.bind(user,8));
            if (iterations == 6)
				queue.add(user.moveTo.bind(user,6)); 
			if (iterations == 7)
                user.moveTo(6);
				
            iterations++;
            if (iterations < 9)
                setTimeout(testFunc, 100);
        };

        function startRendering() {
			gameMap=new Map(stage);
			ingameMenu=new Menu(stage,queue);
			generalMenu=new Menu(stage,queue);

			user=new Player(gameMap,ingameMenu.getLayer(),1500,"./img/test.jpg","./img/test.jpg");
			var enemies=[];
			enemies.push(new Player(gameMap,ingameMenu.getLayer(),1500,"./img/Testing.jpg","./img/Testing.jpg"));
			enemies.push(new Player(gameMap,ingameMenu.getLayer(),1500,"./img/Testing.jpg","./img/Testing.jpg"));
			enemies.push(new Player(gameMap,ingameMenu.getLayer(),1500,"./img/Testing.jpg","./img/Testing.jpg"));
			
			var houseBuildingMenu=houseBuildingWindow.bind(null, generalMenu, gameMap, 5, user, "Accept", "Cancel");

			setUpStandardMenu(ingameMenu,gameMap,user,enemies,houseBuildingMenu);
			setUpStandardMap(gameMap);
			
			user.addBoardFigure("","green");
			queue.start();
			setTimeout(testFunc, 2000); 
        }
    }

    window.login = function () {
        client.send(new LoginPacket('User', ''));
    };

    var client = new Client();
    client.network.link(PingPacket, onPingPacket);
    client.network.link(GameStartPacket, onGameStartPacket);
    client.network.link(NextTurnPacket, onNextTurnPacket);
    client.start();

})();
