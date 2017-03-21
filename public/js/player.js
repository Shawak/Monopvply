function Player(gameMap, ingameMenuLayer, money, profileImgSrc) {

    var layer = ingameMenuLayer;
    var money = money;
    var textBox;
    var fieldCardManager;
    this.imgSrc = profileImgSrc;
    this.boardImgSrc;
    var that = this;
    var gameMap = gameMap;
    var boardFigure;

    this.getAllOwnedFields = function () {
        return fieldCardManager.getAllOwnedFields();
    };

    this.addBoardFigure = function (boardImgSrc, color) {
        boardImgSrc = typeof boardImgSrc !== 'undefined' ? boardImgSrc : "";
        color = typeof color !== 'undefined' ? color : "black";
        if (boardImgSrc == "") {
            this.boardImgSrc = this.imgSrc;
        }

        var imageObj = new Image();
        imageObj.src = this.boardImgSrc;

        boardFigure = new Konva.Circle({
            x: gameMap.getWidthField() / 2,
            y: gameMap.getWidthField() / 2,
            radius: gameMap.getWidthField() / 4,
            stroke: color,
            rotation: 180,
            fillPatternImage: imageObj,
            fillPatternOffset: {x: gameMap.getWidthField() / 4, y: gameMap.getWidthField() / 4},
            strokeWidth: 4
        });
        gameMap.addKonvaObj(boardFigure);
    };

    this.moveTo = function (id) {
        var field = gameMap.getFieldById(id);
        if (field != undefined) {
            boardFigure.setPosition({
                x: field.getX() + gameMap.getWidthField() / 2,
                y: field.getY() + gameMap.getWidthField() / 2
            });
            gameMap.draw();
            return true;
        }
        return false;
    };

    this.buyCard = function (id) {
        var field = gameMap.getFieldById(id);
        if (field != undefined && money >= field.getCosts()) {
            fieldCardManager.addCard(field);
            that.updateMoney(money - field.getCosts(), true);
            return true;
        }
        return false;
    };

    this.createCardManager = function (xStart, yStart, cardWidth, cardHeight) {
        fieldCardManager = new CardManager(gameMap, ingameMenu, xStart, yStart, cardWidth, cardHeight);
    };

    this.setMoneyTextbox = function (moneyText) {
        textBox = moneyText;
    };

    this.updateMoney = function (newMoney, animation) {
        money = newMoney;

        animation = typeof animation !== 'undefined' ? animation : true;
        if (animation) {
            var colorBefore = textBox.fill();
            var animationColor = "red";

            if (newMoney > money) {
                animationColor = "green";
            }

            textBox.fill(animationColor);
            layer.draw();
            setTimeout(function () {
                textBox.text(newMoney + " eg");
                textBox.fill(colorBefore);
                layer.draw();
            }, 300);
        }
        else {
            textBox.text(newMoney + " eg");
            layer.draw();
        }

    }
}