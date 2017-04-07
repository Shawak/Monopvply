
function Player(playerId, gameMap, ingameMenuLayer, informationMenu, money, color, profileImgSrc)
{
	var currFieldPosition=0;
	var informationMenu=informationMenu;
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
	var busyMoving=false;
	var playerColor=color;
	var playerName="Username";
	var id=playerId;
	var buyButton;
	var currentField;
	
	this.setBuyButton=function(button)
	{
		buyButton=button;
	}
	
	this.getCurrentField=function()
	{
		return currentField;
	}
	
	this.updateBuyButton=function(visible, field)
	{
		if(visible==false)
		{
			buyButton[0].hide();
			buyButton[1].hide();
			layer.draw();
			return false;
		}
		
		buyButton[0].show();
		buyButton[1].show();
		layer.draw();
		currentField=field;
		return true;
	}
	
	this.getPosition=function()
	{
		return currFieldPosition;
	}
	
	this.setId = function(newId)
	{
		id=newId;
	}
	
	this.getId = function()
	{
		return id;
	}
	
	this.getName = function()
	{
		return playerName;
	}
	
	this.getColor = function()
	{
		return playerColor;
	}
	
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

	this.updateState = function(state)
	{
		if(state.money!=money)
		{
			return that.updateMoney(state.money);
		}
		
		if(state.position!=gameMap.getFieldByPosition(currFieldPosition))
		{
			var success=that.moveTo(state.position);
			return success;
		}
		return true;
	}
	
	this.addBoardFigure = function(boardImgSrc)
	{
		boardImgSrc = typeof boardImgSrc !== 'undefined' ? boardImgSrc : "";
		if(boardImgSrc=="")
		{
			this.boardImgSrc=this.imgSrc;
		}
		
		var imageObj = new Image();
		imageObj.src = this.boardImgSrc;

	    boardFigure = new Konva.Circle(
	    {
	      x: gameMap.getWidthField()/2,
	      y: gameMap.getHeightField()/2,
	      radius: gameMap.getWidthField()/4,
	      stroke: playerColor,
		  rotation:180,
		  fillPatternImage: imageObj,
		  fillPatternOffset: { x : gameMap.getWidthField()/4, y : gameMap.getWidthField()/4},
	      strokeWidth: 4
	    });
	    gameMap.addKonvaObj(boardFigure);
		boardFigure.moveToTop();
	}


	this.moveTo = function(id)
	{
		if(busyMoving==true)
		{
			return false;
		}
		
		busyMoving=true;
		var field=gameMap.getFieldById(id);
		if(field!= undefined)
		{
			var endPos=gameMap.getPositionOfField(field);
			
			var fieldsBetween=gameMap.getFieldsBetween(currFieldPosition,endPos-currFieldPosition);
			currFieldPosition=endPos;
			
			if(fieldsBetween==undefined || fieldsBetween.length==0)
			{
				busyMoving=false;
				return false;
			}
			var fieldBefore;
			var currField;
			var amountSteps=50;
			var stepsPerStreet=(amountSteps/fieldsBetween.length)|0;
			
			fieldBefore=fieldsBetween[0];
			currField=fieldsBetween[0];
			
			var counter=0;
			var countSteps=0;
			var anim;
			var currX=boardFigure.x();
			var currY=boardFigure.y();
			fieldBefore=fieldsBetween[0];
			currField=fieldsBetween[1];
			
			anim = new Konva.Animation(function(frame) 
			{
				currX-=(fieldBefore.getX()-currField.getX())/stepsPerStreet;
				currY-=(fieldBefore.getY()-currField.getY())/stepsPerStreet;
				
				boardFigure.setPosition(
				{
					x: currX, 
					y: currY
				});
				
				countSteps++;
				if(countSteps>=stepsPerStreet)
				{
					counter++;
					countSteps=0;
					fieldBefore=currField;
					currField=fieldsBetween[counter];	
				}
				if(counter>=fieldsBetween.length)
				{
					anim.stop();
					busyMoving=false;
					if(field.isBuyable())
					{
						updateBuyButton(true,field);
					}
				}
				
			}, gameMap.getLayer());
			anim.start();
			
			gameMap.draw();	
			return true;
		}
		busyMoving=false;
		return false;
	}

	this.addCard = function(id)
	{
		var field=gameMap.getFieldById(id);
		if(field!= undefined)
		{
			fieldCardManager.addCard(field);
			return true;
		}
		return false;
	}
	
	this.buyCard = function(id, animation)
	{
		if(busy==true)
		{
			return false;
		}
		busy=true;
		animation = typeof animation !== 'undefined' ? animation : true;
		var field=gameMap.getFieldById(id);
		if(field!= undefined && money>=field.getCosts())
		{
			fieldCardManager.addCard(field);
			that.updateMoney(money-field.getCosts(),animation);
			return true;
		}
		busy=false;
		return false;
	}
	
	this.createCardManager = function(ingameMenu, xStart, yStart, cardWidth, cardHeight)
	{
		fieldCardManager=new CardManager(this,gameMap, ingameMenu, informationMenu, xStart, yStart, cardWidth, cardHeight);
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
			}, 500); 
		}		
		else
		{
			textBox.text(newMoney+" eg");
			layer.draw();
			money=newMoney;
			busy=false;
		}
		return true;		
	}
}