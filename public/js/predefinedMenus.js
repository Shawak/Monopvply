function fieldInformationWindow(informationMenu, houseText1, houseText2, hypothekText, closeText, field, mortgageText, mortgageCallback)
{
	if(informationMenu.isBusy())
	{ 
		return;
	}
	informationMenu.clear();
	informationMenu.setDraggable(true);
	informationMenu.hideAll(false);
	
	mortgageText = typeof mortgageText !== 'undefined' ? mortgageText : "";
	mortgageCallback = typeof mortgageCallback !== 'undefined' ? mortgageCallback : undefined;
	
	if(mortgageText=="")
	{
		if(field.isCharged())
		{
			mortgageText=GLOBAL_UNMORTGAGE_TEXT;
		}
		else
		{
			mortgageText=GLOBAL_MORTGAGE_TEXT;
		}
	}

	var width = window.innerWidth;
    var height = window.innerHeight;
	
	var menuWidth=width/4.5;
	
	var menuOffsetX=width/2-menuWidth/2;
	var menuOffsetY=height/6;
	
	var margin=16;
	
	var fieldRect=informationMenu.addTextInRect(menuOffsetX,menuOffsetY,menuWidth, field.getText(), field.getColor(),true);

	var rent=field.getRent();
	var currY=menuOffsetY+margin/2+fieldRect[0].getHeight();
	
	var text=informationMenu.addText(menuOffsetX, currY, menuWidth, field.getCosts()+" "+GLOBAL_MONEY_VAR, false);
	currY+=text.getHeight()+margin*1.5;
	for(var i=0;i<rent.length;i++)
	{
		text= informationMenu.addText(menuOffsetX, currY, menuWidth/1.5, houseText1+" "+i+" "+houseText2, false);
		text=informationMenu.addText(menuOffsetX+menuWidth/1.5+margin, currY, menuWidth/3, rent[i]+" "+GLOBAL_MONEY_VAR, false);
		currY+=text.getHeight()+margin;
	}
	 
	currY+=margin;
	text=informationMenu.addText(menuOffsetX, currY, menuWidth, hypothekText+" "+field.getHypothekWorth()+" "+GLOBAL_MONEY_VAR, false);
	currY+=text.getHeight()+margin;
	  
	var menuHeight=currY-menuOffsetY;
	informationMenu.addMenuBackground(menuOffsetX-8,menuOffsetY-8,menuWidth+16,menuHeight+54,"","black",true);
	
	var callbackClose=function()
	{
		informationMenu.hideAll(true);
		return true;
	}

	if(mortgageText=="" || mortgageCallback==undefined)
	{
		informationMenu.addButton(menuOffsetX+menuWidth/2-60, currY, 120, 30, closeText, callbackClose);
	}
	else
	{
		informationMenu.addButton(menuOffsetX+menuWidth-120-margin, currY, 120, 30, closeText, callbackClose);
		
		var callbackMortgage=function()
		{
			informationMenu.hideAll(true);
			if(mortgageCallback!=undefined && mortgageCallback!="")
			{
				mortgageCallback();
			}
			return true;
		}
		informationMenu.addButton(menuOffsetX+margin, currY, 120, 30, mortgageText, callbackMortgage);
	}
	informationMenu.draw();
}

function houseBuildingWindow(generalMenu, gameMap, maxHouses, playerObj, textAccept,textCancel,  acceptCallback, cancelCallback,showSellButton)
{
	if(generalMenu.isBusy() || playerObj.isBusy())
	{ 
		return;
	}
	playerObj.setBusy(true);
	generalMenu.setBusy(true);
	
	showSellButton = typeof showSellButton !== 'undefined' ? showSellButton : true;
	acceptCallback = typeof acceptCallback !== 'undefined' ? acceptCallback : undefined;
	cancelCallback = typeof cancelCallback !== 'undefined' ? cancelCallback : undefined;
	
	generalMenu.clear();
	generalMenu.setDraggable(true);
	generalMenu.hideAll(false);
	var fields=gameMap.getSideFields();
	var streetsPerGroup=[];

	for(var i=0;i<fields.length;i++)
	{
		var group=fields[i].getGroup();
		if(streetsPerGroup[group] === undefined)
		{
			streetsPerGroup[group]=0;
		}
		streetsPerGroup[group]++;
	}

	var ownedFields=playerObj.getAllOwnedFields();

	for(var i=0;i<ownedFields.length;i++)
	{
		if(ownedFields[i].isCharged()==false)
		{
			var group=ownedFields[i].getGroup();
			streetsPerGroup[group]--;
		}
	}

	var fullStreets=[];
	var housesBefore=[];
	
	for(var i=0;i<ownedFields.length;i++)
	{
		var group=ownedFields[i].getGroup();
		if(streetsPerGroup[group]!==undefined && streetsPerGroup[group]==0)
		{
			fullStreets.push(ownedFields[i]);
			housesBefore.push(ownedFields[i].getHouses());
		}
	}

	if(fullStreets.length==0)
	{ 
		generalMenu.setBusy(false);
		playerObj.setBusy(false);
		alert("There is nothing to build on!");
		return;
	}
	
	var width = window.innerWidth;
    var height = window.innerHeight;
    var houseWidth=width/(maxHouses*1.5);
	
    var menuWidth=maxHouses*houseWidth/3+houseWidth;
    var menuHeight=height/1.5;

	var currMoney=playerObj.getMoney();
	var textObj=generalMenu.addText(0,0,houseWidth,currMoney+" "+GLOBAL_MONEY_VAR);
	
    var currHeight=0;
	for(var i=0;i<fullStreets.length;i++)
	{
		var house=generalMenu.addTextInRect(width/2-menuWidth/2,currHeight+height/7,houseWidth, fullStreets[i].getText(), fullStreets[i].getColor(),true);
		var houseHeight=house[0].getHeight();
		var houseRects=[];
		for(var j=0;j<maxHouses;j++)
		{
			var color="white";
			if(j<fullStreets[i].getHouses())
			{
				color="gray";
			}
			
			var rect=generalMenu.addRect(houseWidth+j*houseWidth/3+width/2-menuWidth/2,currHeight+height/7,houseWidth/3, houseHeight,color,true);
			houseRects.push(rect);
		}
		
		var addOneHouse=addOneHouseInBuildingMenu.bind(null, generalMenu.getLayer(), fullStreets[i], houseRects, textObj, currMoney, fullStreets[i].getHouses(),playerObj);
		generalMenu.addButton((maxHouses)*houseWidth/3+houseWidth+width/2-menuWidth/2+16+houseHeight, currHeight+height/7, houseHeight, houseHeight, "+", addOneHouse, "Buy one house");
		if(showSellButton==true)
		{
			var sellOneHouse=sellOneHouseInBuildingMenu.bind(null, generalMenu.getLayer(), fullStreets[i], houseRects, textObj, currMoney, fullStreets[i].getHouses(), playerObj);
			generalMenu.addButton((maxHouses)*houseWidth/3+houseWidth+width/2-menuWidth/2+8, currHeight+height/7, houseHeight, houseHeight, "-", sellOneHouse, "Sell one house");
		}
		
		currHeight+=house[0].getHeight();
	}
	generalMenu.addMenuBackground(width/2-menuWidth/2-16,height/7-16,menuWidth+2*houseHeight+48,currHeight+64,"","black",true);

	textObj.x(width/2-menuWidth/2);
	textObj.y(currHeight+height/7+8);
	
	var callbackAccept=function()
	{
		generalMenu.hideAll(true);
		var money=playerObj.getMoney();
		playerObj.setMoney(currMoney);
		playerObj.updateMoney(money);
		if(acceptCallback!=undefined)
		{
			if(acceptCallback()===false)
			{
				return false;
			}
		}
		generalMenu.setBusy(false);
		playerObj.setBusy(false);
		return true;
	}
	
	var callbackCancel=function()
	{
		generalMenu.hideAll(true);
		playerObj.setMoney(currMoney);
		for(var i=0;i<fullStreets.length;i++)
		{
			fullStreets[i].setHouses(housesBefore[i]);
		}
		if(cancelCallback!=undefined)
		{
			if(cancelCallback()===false)
			{
				return false;
			}
		}
		generalMenu.setBusy(false);
		playerObj.setBusy(false);
		return true;
	}

	generalMenu.addButton((maxHouses-3)*houseWidth/3+width/2-menuWidth/2+houseWidth-8, currHeight+height/7+8, Math.max(houseWidth/3,70), 30, textAccept, callbackAccept, "Confirm bought/sold houses");
	generalMenu.addButton((maxHouses-1)*houseWidth/3+width/2-menuWidth/2+houseWidth, currHeight+height/7+8, Math.max(houseWidth/3,70), 30, textCancel, callbackCancel, "Cancel buying/selling houses");

	generalMenu.draw();
}

function acceptWindow(generalMenu, text, yesCallback, noCallback)
{   
	if(generalMenu.isBusy())
	{
		return;
	}
	
	generalMenu.setBusy(true);
	
	generalMenu.hideAll(false);
	generalMenu.setDraggable(false);
	generalMenu.clear();
	var width = window.innerWidth;
    var height = window.innerHeight;
	
	var menuWidth=Math.max(text.length*5,150);
	
	var okCallbackHide=function()
	{
		generalMenu.hideAll(true);
		if(yesCallback!=undefined)
		{
			if(yesCallback()===false)
			{
				return false;
			}
		}
		generalMenu.setBusy(false);
		return true;
	}
	
	var notOkCallbackHide=function()
	{
		generalMenu.hideAll(true);
		if(noCallback!=undefined)
		{
			if(noCallback()===false)
			{
				return false;
			}
		}
		generalMenu.setBusy(false);
		return true;
	}
	
	var textObj=generalMenu.addText(width/2-menuWidth/2+8,height/3+8,menuWidth-16,text);
	
	generalMenu.addMenuBackground(width/2-menuWidth/2,height/3,menuWidth,textObj.getHeight()+58);
	
	generalMenu.addButton(width/2-menuWidth/2+20, height/3+textObj.getHeight()+16, 60, 30, "Yes", okCallbackHide, "");
	generalMenu.addButton(width/2+menuWidth/2-80, height/3+textObj.getHeight()+16, 60, 30, "No", notOkCallbackHide, "");
	
	generalMenu.draw();
}

function setUpStandardMenu(ingameMenu, gameMap, user, enemyArray, buildingMenuCallback)
{
	var container = document.querySelector('#stage-parent');
	var containerWidth = container.offsetWidth;
	var containerHeight = container.offsetHeight;

	var marginWidth=containerWidth/40;
	var marginHeight=containerHeight/40;

	var profileImageSizeEnemy=containerWidth/14;
	var profileImageSize=containerWidth/9;
	var profileImageMargin=Math.min(marginWidth,marginHeight);
	var margin=profileImageMargin;

	ingameMenu.addMenuBackground(profileImageMargin, profileImageMargin, profileImageSize, profileImageSize+30);
	ingameMenu.addImage(profileImageMargin, profileImageMargin, profileImageSize, profileImageSize, user.imgSrc);

	var textMoney=ingameMenu.addText(profileImageMargin, profileImageMargin+profileImageSize, profileImageSize, "1500 "+GLOBAL_MONEY_VAR);
	user.setMoneyTextbox(textMoney);

	ingameMenu.addButton(containerWidth/2+30, 0, 60, 30, "»", gameMap.rotateRight, "Rotate whole map by +90°");
	ingameMenu.addButton(containerWidth/2-30, 0, 60, 30, "«", gameMap.rotateLeft, "Rotate whole map by -90°");

	user.createCardManager(containerWidth/4, containerHeight-124, 100, 140);

	for(var i=0;i<enemyArray.length;i++)
	{
		var x=containerWidth-profileImageMargin-profileImageSizeEnemy;
		var y=(margin+profileImageSizeEnemy+30)*(i+1);
		ingameMenu.addMenuBackground(x, y, profileImageSizeEnemy, profileImageSizeEnemy+30);
		ingameMenu.addImage(x, y, profileImageSizeEnemy, profileImageSizeEnemy, enemyArray[i].imgSrc);

		var textMoneyEnemy=ingameMenu.addText(x, y+profileImageSizeEnemy, profileImageSizeEnemy, "1500 "+GLOBAL_MONEY_VAR);
		enemyArray[i].setMoneyTextbox(textMoneyEnemy);
	}

	ingameMenu.addButton(profileImageMargin, profileImageMargin+profileImageSize+16+textMoneyEnemy.getHeight(), profileImageSize, 30, "Building Menu", buildingMenuCallback, "Opens menu to buy and sell houses");

	/*
	var boundAlert2=myAlert.bind(null,"Yay, you clicked Field Card 'Last Chaos'!");
	ingameMenu.addFieldCard(50, 80, 70, 80, "Last Chaos", "lightblue", boundAlert2,"./img/streets/2_mmorpg/2_last_chaos.jpg");
	*/
}