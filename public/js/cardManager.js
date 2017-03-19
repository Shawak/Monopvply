
function CardManager(gameMap, ingameMenu, xStart, yStart, cardWidth, cardHeight)
{
	var ingameMenu=ingameMenu;
	var gameMap=gameMap;
	var xStart=xStart;
	var yStart=yStart;
	var currX=xStart;
	var currY=yStart;
	var cardWidth=cardWidth;
	var cardHeight=cardHeight;
	var cardBackground;
	var overlapFactor=1.6;
	
	init();
	
	function init()
	{
		cardBackground=ingameMenu.addMenuBackground(xStart-cardWidth/8, yStart-cardHeight/8, cardWidth/4+(cardWidth-cardWidth/overlapFactor), cardHeight+cardHeight/4);
	}
	
	function nextPlace()
	{
		currX+=(cardWidth/overlapFactor)|0;
		cardBackground.width(cardBackground.width()+cardWidth/overlapFactor);
	}
	
	this.addCardById = function(id)
	{
		var field=gameMap.getFieldById(id);
		if(field==undefined)
		{
			return false;
		}
		
		var myAlert=function(txt)
		{
			alert(txt);
		}
		var boundAlert2=myAlert.bind(null,"Card Manager: You clicked '"+text+"'!");
		ingameMenu.addFieldCard(currX, currY, cardWidth, cardHeight, text, field.getColor(), boundAlert2,field.getImgSrc());
		
		nextPlace();
		return true;
	}
	
	this.addCard = function(field)
	{
		if(field==undefined)
		{
			return false;
		}
		
		var myAlert=function(txt)
		{
			alert(txt);
		}
		var boundAlert2=myAlert.bind(null,"Card Manager: You clicked '"+field.getText()+"'!");
		ingameMenu.addFieldCard(currX, currY, cardWidth, cardHeight, field.getText(), field.getColor(), boundAlert2,field.getImgSrc());
		
		nextPlace();
		return true;
	}
}