
function CardManager(playerObj, gameMap, ingameMenu, informationMenu, xStart, yStart, cardWidth, cardHeight)
{
	var player=playerObj;
	var ingameMenu=ingameMenu;
	var informationMenu=informationMenu;
	var gameMap=gameMap;
	var xStart=xStart;
	var yStart=yStart;
	var currX=xStart;
	var currY=yStart;
	var cardWidth=cardWidth;
	var cardHeight=cardHeight;
	var cardBackground;
	var overlapFactor=1.6;
	var ownedFields=[];
	var that=this;
	
	init();
	
	function init()
	{
		//cardBackground=ingameMenu.addMenuBackground(xStart-cardWidth/8, yStart-cardHeight/8, cardWidth/4+(cardWidth-cardWidth/overlapFactor), cardHeight+cardHeight/4);
	}
	
	function reorder()
	{
		currX=xStart;
		for(var i=0;i<ownedFields.length;i++)
		{
			ownedFields[i][1][0].x(currX);
			currX+=(cardWidth/overlapFactor)|0;
		}
		//cardBackground.width(cardBackground.width()+cardWidth/overlapFactor);
	}
	
	this.getCard=function(fieldId)
	{
		for(var i=0;i<ownedFields.length;i++)
		{
			if(fieldId==ownedFields[i][0].getId())
			{
				return ownedFields[i];
			}
			
		}
		return undefined;
	}
	
	this.addCardById = function(id)
	{
		var field=gameMap.getFieldById(id);
		return that.addCard(field);
	}
	
	this.getAllOwnedFields = function()
	{
		var realFields=[];
		for(var i=0;i<ownedFields.length;i++)
		{
			realFields.push(ownedFields[i][0]);
		}
		return realFields;
	}

	this.removeCardById=function(fieldId)
	{
		var idx=undefined;
		for(var i=0;i<ownedFields.length;i++)
		{
			if(fieldId==ownedFields[i][0].getId())
			{
				idx=i;
				break;
			}
		}
		
		if(idx!=undefined)
		{
			ownedFields.splice(index, 1);
			reorder();
			return true;
		}
		
		return false;
	}
	
	this.addCard = function(field)
	{
		if(field==undefined)
		{
			return false;
		}
		
		if(typeof xStart === 'undefined')
		{
			ownedFields.push([field,undefined]);
			return true;
		}
		
		var newCard=ingameMenu.addFieldCard(currX, currY, cardWidth, cardHeight, field.getText(), field.getColor(), undefined,field.getImgSrc());

		ownedFields.push([field,newCard]);
		ownedFields.sort(function(a,b) {return a[0].getId() - b[0].getId();} );
		
		var chargeCallback=function()
		{
			if(field.isCharged())
			{
				client.send(new PlayerUnmortgagePacket(field.getId()));
			}
			else
			{
				client.send(new PlayerMortgagePacket(field.getId()));
			}
			return true;
		};
		
		var cardMenu=fieldInformationWindow.bind(null,informationMenu, GLOBAL_MORTGAGE_FOR_TEXT, GLOBAL_HOUSES_TEXT, GLOBAL_MORTGAGE_ACTION_TEXT, GLOBAL_CLOSE_TEXT, field, "",chargeCallback);
		newCard[0].on("click",cardMenu);
		
		reorder();
		return true;
	}
}