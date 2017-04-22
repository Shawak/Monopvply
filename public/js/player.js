
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
	var buyButton=undefined;
	var currentField;
	
	this.isMoving = function()
	{
		return busyMoving;
	}
	
	this.setBuyButton=function(button)
	{
		buyButton=button;
	}
	
	this.setCharged=function(fieldId,charge)
	{
		var card=fieldCardManager.getCard(fieldId);
		var field=card[0];
		var newCard=card[1];
		
		if(charge==false && field.isCharged())
		{
			var chargeObj = newCard[1];
			if(chargeObj!=undefined)
			{
				chargeObj.hide();
			}
			newCard[0].cache();
			field.setCharged(false);
		}
		else if(charge==true && field.isCharged()==false)
		{
			var chargeObj = newCard[1];
			console.log(chargeObj);
			if(chargeObj!=undefined)
			{
				chargeObj.show();
			}
			newCard[0].cache();
			field.setCharged(true);
		}
	}
	
	this.getCurrentField=function()
	{
		return currentField;
	}
	
	this.updateBuyButton=function(visible, field)
	{
		if(visible==true)
		{
			currentField=field;
		}
		
		if(buyButton==undefined || buyButton.length==0)
		{
			return false;
		}
		
		if(visible==false)
		{
			buyButton[0].hide();
			buyButton[1].hide();
			layer.draw();
			return true;
		}
		
		buyButton[0].show();
		buyButton[1].show();
		layer.draw();
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
	
	this.ownsField = function (fieldId)
	{
		var fields=fieldCardManager.getAllOwnedFields();
		if(fields!=undefined)
		{
			for(var i=0;i<fields.length;i++)
			{
				if(fields[i].getId()==fieldId)
				{
					return true;
				}
			}
		}
		return false;
	}
	
	this.getAllOwnedFields=function()
	{
		return fieldCardManager.getAllOwnedFields();
	}

	this.updateState = function(state)
	{
		var success=true;
		if(state.money!=money)
		{
			success&=that.updateMoney(state.money);
		}
		
		if(state.position!=gameMap.getFieldByPosition(currFieldPosition))
		{
			success&=that.moveTo(state.position);
		}
		return success;
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
	      x: gameMap.getWidthField()/2+Math.floor(Math.random() * 12) - 6 ,
	      y: gameMap.getHeightField()/2+Math.floor(Math.random() * 12) - 6,
	      radius: gameMap.getWidthField()/4.5,
	      stroke: playerColor,
		  rotation:180,
		  fillPatternImage: imageObj,
		  fillPatternOffset: { x : gameMap.getWidthField()/4.5, y : gameMap.getWidthField()/4.5},
	      strokeWidth: 5
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
				if(currField!=undefined)
				{
					currX-=(fieldBefore.getX()-currField.getX())/stepsPerStreet;
					currY-=(fieldBefore.getY()-currField.getY())/stepsPerStreet;
				}
				
				
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
						that.updateBuyButton(true,field);
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
			field.setBought(true,this);
			return true;
		}
		return false;
	}
	
	this.removeCard = function(id)
	{
		if(id!= undefined)
		{
			fieldCardManager.removeCardById(id);
			
			var field=gameMap.getFieldById(id);
			if(field!= undefined)
			{
				field.setBought(false);
			}
			
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
			field.setBought(true,this);
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