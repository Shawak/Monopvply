
function Player(gameMap, ingameMenuLayer, money, profileImgSrc, boardImgSrc)
{
	var layer=ingameMenuLayer;
	var money=money;
	var textBox;
	var fieldCardManager;
	this.imgSrc=profileImgSrc;
	this.boardImgSrc=boardImgSrc;
	var that=this;
	var gameMap=gameMap;
	
	this.buyCard = function(text)
	{
		var field=gameMap.getFieldByText(text);
		if(field!= undefined && money>=field.getCosts())
		{
			fieldCardManager.addCard(field);
			that.updateMoney(money-field.getCosts(),true);
		}
	}
	
	this.createCardManager = function(xStart, yStart, cardWidth, cardHeight)
	{
		fieldCardManager=new CardManager(gameMap, ingameMenu, xStart, yStart, cardWidth, cardHeight);
	}
	
	this.setMoneyTextbox = function(moneyText)
	{
		textBox=moneyText;
	}
	
	this.updateMoney =function(newMoney, animation)
	{
		money=newMoney;
		
		animation=typeof animation !== 'undefined' ? animation : true;
		if(animation)
		{
			var colorBefore=textBox.fill();
			var animationColor="red";
			
			if(newMoney>money)
			{
				animationColor="green";
			}
			
			textBox.fill(animationColor);
			layer.draw();
			setTimeout(function()
			{ 
				textBox.text(newMoney+" e*gold");
				textBox.fill(colorBefore);
				layer.draw();
			}, 300); 
		}		
		else
		{
			textBox.text(newMoney+" e*gold");
			layer.draw();
		}
		
	}
}