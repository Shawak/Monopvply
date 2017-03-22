
function Player(gameMap, ingameMenuLayer, money, profileImgSrc)
{

	var layer=ingameMenuLayer;
	var money=money;
	var textBox;
	var fieldCardManager;
	this.imgSrc=profileImgSrc;
	this.boardImgSrc;
	var that=this;
	var gameMap=gameMap;
	var boardFigure;
	var busy=false;
	var textColor;
	
	this.setBusy = function(state)
	{
		busy=state;
	}
	
	this.isBusy = function()
	{
		return busy;
	}
	
	this.getMoney=function()
	{
		return money;
	}
	
	this.setMoney = function(newMoney)
	{
		money=newMoney;
	}
	
	this.getAllOwnedFields=function()
	{
		return fieldCardManager.getAllOwnedFields();
	}

	this.addBoardFigure = function(boardImgSrc,color)
	{
		boardImgSrc = typeof boardImgSrc !== 'undefined' ? boardImgSrc : "";
		color = typeof color !== 'undefined' ? color : "black";
		if(boardImgSrc=="")
		{
			this.boardImgSrc=this.imgSrc;
		}
		
		var imageObj = new Image();
		imageObj.src = this.boardImgSrc;

	    boardFigure = new Konva.Circle(
	    {
	      x: gameMap.getWidthField()/2,
	      y: gameMap.getWidthField()/2,
	      radius: gameMap.getWidthField()/4,
	      stroke: color,
		  rotation:180,
		  fillPatternImage: imageObj,
		  fillPatternOffset: { x : gameMap.getWidthField()/4, y : gameMap.getWidthField()/4},
	      strokeWidth: 4
	    });
	    gameMap.addKonvaObj(boardFigure);
	}

	this.moveTo = function(id)
	{
		busy=true;
		var field=gameMap.getFieldById(id);
		if(field!= undefined)
		{
			boardFigure.setPosition({x: field.getX()+gameMap.getWidthField()/2, y: field.getY()+gameMap.getWidthField()/2});
			gameMap.draw();	
			busy=false;
			return true;
		}
		busy=false;
		return false;
	}

	this.buyCard = function(id, animation)
	{
		animation = typeof animation !== 'undefined' ? animation : true;
		var field=gameMap.getFieldById(id);
		if(field!= undefined && money>=field.getCosts())
		{
			fieldCardManager.addCard(field);
			that.updateMoney(money-field.getCosts(),animation);
			return true;
		}
		return false;
	}
	
	this.createCardManager = function(xStart, yStart, cardWidth, cardHeight)
	{
		fieldCardManager=new CardManager(gameMap, ingameMenu, xStart, yStart, cardWidth, cardHeight);
	}
	
	this.setMoneyTextbox = function(moneyText)
	{
		busy=true;
		textBox=moneyText;
		textColor=textBox.fill();
		busy=false;
	}
	
	this.updateMoney =function(newMoney, animation)
	{
		busy=true;
		animation=typeof animation !== 'undefined' ? animation : true;
		if(animation)
		{
			var animationColor="red";
			
			if(newMoney>money)
			{
				animationColor="green";
			}
			money=newMoney;
			textBox.fill(animationColor);
			layer.draw();
			setTimeout(function()
			{ 
				textBox.text(money+" eg");
				textBox.fill(textColor);
				layer.draw();
				busy=false;
			}, 250); 
		}		
		else
		{
			textBox.text(newMoney+" eg");
			layer.draw();
			money=newMoney;
			busy=false;
		}	
	}
}