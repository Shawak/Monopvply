function tradingWindow(generalMenu, playerObj, enemyObj, textOffer, textCancel, offerCallback, cancelCallback)
{
	if(generalMenu.isBusy() || playerObj.isBusy() || enemyObj.isBusy())
	{ 
		return true;
	}

	playerObj.setBusy(true);
	generalMenu.setBusy(true);
	enemyObj.setBusy(true);

	var offerArray={streets:[], money:0,id:playerObj.getId()};
	var requestArray={streets:[], money:0,id:enemyObj.getId()};
	
	offerCallback = typeof offerCallback !== 'undefined' ? offerCallback : undefined;
	cancelCallback = typeof cancelCallback !== 'undefined' ? cancelCallback : undefined;
	
	generalMenu.clear();
	generalMenu.setDraggable(true);
	generalMenu.hideAll(false);
	
	var width = window.innerWidth;
    var height = window.innerHeight;
	
	var menuWidth=Math.max(width/1.75,830);
	
	var menuOffsetX=width/2-menuWidth/2;
	var menuOffsetY=height/6;
	
	var margin=8;
	var currY=menuOffsetY+margin;
	
	var ownedFields=playerObj.getAllOwnedFields();
	var ownedEnemyFields=enemyObj.getAllOwnedFields();
	
	var myTextBox = generalMenu.addTextInRect(menuOffsetX+margin, menuOffsetY+margin, menuWidth/2-margin*2, playerObj.getName(), playerObj.getColor());
	var enemyTextBox = generalMenu.addTextInRect(menuOffsetX+margin*3+menuWidth/2, menuOffsetY+margin, menuWidth/2-margin*2, enemyObj.getName(), enemyObj.getColor());

	currY+=Math.max(enemyTextBox[0].getHeight(),myTextBox[0].getHeight())+margin;
	var startLine=currY;
	
	var ownedCardsText=generalMenu.addText(menuOffsetX+margin, currY, menuWidth/4-margin*2,"Owned Cards");
	generalMenu.addText(menuOffsetX+margin*2+menuWidth/4, currY, menuWidth/4-margin*2,"Send");
	generalMenu.addText(menuOffsetX+margin*2+menuWidth/4*2, currY, menuWidth/4-margin*2,"Recieve");
	generalMenu.addText(menuOffsetX+margin*2+menuWidth/4*3, currY, menuWidth/4-margin*2,"Enemy Cards");

	currY+=ownedCardsText.getHeight()+margin;
	
	var currY2=currY;
	
	var cardCurrX=menuOffsetX+margin;
	var myMaxX=menuOffsetX+menuWidth/4;
	var cardWidth=70;
	var cardHeight=90;
	var player1SendingLineX=menuOffsetX+menuWidth/4+margin;
	
	var cards=[];
	var cardsTrading=[];
	
	function sendCard(i)
	{
		offerArray.streets[i]=ownedFields[i];
		
		cards[i][0].hide();
		cardsTrading[i][0].show();
		generalMenu.draw();
	}
	
	function dontSendCard(i)
	{
		offerArray.streets[i]=undefined;
		
		cards[i][0].show();
		cardsTrading[i][0].hide();
		generalMenu.draw();
	}
	
	for(var i=0;i<ownedFields.length;i++)
	{
		if(cardCurrX+cardWidth*1.1>=myMaxX)
		{
			cardCurrX=menuOffsetX+margin;
			currY+=cardHeight/1.33;
		}

		var newCard=generalMenu.addFieldCard(cardCurrX, currY, cardWidth, cardHeight, ownedFields[i].getText(), ownedFields[i].getColor(), sendCard.bind(null,i), ownedFields[i].getImgSrc(),false);
		var newCardTrading=generalMenu.addFieldCard(cardCurrX+menuWidth/4+margin*2, currY, cardWidth, cardHeight, ownedFields[i].getText(), ownedFields[i].getColor(), dontSendCard.bind(null,i), ownedFields[i].getImgSrc(),false);
		newCardTrading[0].hide();
		
		cards[i]=newCard;
		cardsTrading[i]=newCardTrading;
		
		cardCurrX+=cardWidth/1.33;
	}
	player1SendingLineX+=margin;
	currY+=cardHeight*1.33;
	
	cardCurrX=menuOffsetX+menuWidth/4*3;
	var enemyMaxX=menuOffsetX+menuWidth;
	var player2SendingLineX=cardCurrX-margin;
	cardCurrX+=margin;
	
	var enemyCards=[];
	var enemyCardsTrading=[];
	
	function getCard(i)
	{
		requestArray.streets[i]=ownedFields[i];
		
		enemyCards[i][0].hide();
		enemyCardsTrading[i][0].show();
		generalMenu.draw();
	}
	
	function dontGetCard(i)
	{
		requestArray.streets[i]=undefined;
		
		enemyCards[i][0].show();
		enemyCardsTrading[i][0].hide();
		generalMenu.draw();
	}
	
	for(var i=0;i<ownedEnemyFields.length;i++)
	{
		if(cardCurrX+cardWidth*1.1>=enemyMaxX)
		{
			cardCurrX=menuOffsetX+margin+menuWidth/4*3;
			currY2+=cardHeight/1.33;
		}
		var newCard=generalMenu.addFieldCard(cardCurrX, currY2, cardWidth, cardHeight, ownedEnemyFields[i].getText(), ownedEnemyFields[i].getColor(), getCard.bind(null,i),ownedEnemyFields[i].getImgSrc(),false);
		var newCardTrading=generalMenu.addFieldCard(cardCurrX-menuWidth/4+margin, currY2, cardWidth, cardHeight, ownedEnemyFields[i].getText(), ownedEnemyFields[i].getColor(), dontGetCard.bind(null,i),ownedEnemyFields[i].getImgSrc(),false);
		newCardTrading[0].hide();
		
		enemyCards[i]=newCard;
		enemyCardsTrading[i]=newCardTrading;
		
		cardCurrX+=cardWidth/1.33;
	}
	player2SendingLineX+=margin;
	
	currY2+=cardHeight*1.33;	

	currY=Math.max(currY,currY2);
	
	var textBox;
	var negativeNumber=false;
	var textBoxWidth=menuWidth/4-2*margin;
	
	generalMenu.addLine(menuOffsetX+margin, currY,menuOffsetX+menuWidth+margin,currY);
	currY+=margin/2;
	
	var myBox=generalMenu.addText(menuOffsetX+margin+menuWidth/4, currY, textBoxWidth, "");
	var	enemyBox=generalMenu.addText(menuOffsetX+margin+menuWidth/4*2, currY, textBoxWidth, "");
	
	var currMoney=0;
	
	var callbackAdd=function(addMoney)
	{
		currMoney+=addMoney;
		
		if(currMoney>0)
		{
			offerArray.money=0;
			requestArray.money=Math.abs(currMoney);
			
			enemyBox.text(Math.abs(currMoney));
			myBox.text("");
		}
		else
		{
			offerArray.money=Math.abs(currMoney);
			requestArray.money=0;
			
			myBox.text(Math.abs(currMoney));
			enemyBox.text("");
		}
		
		generalMenu.draw();
		return true;
	}
	
	currY+=margin/2;
	
	var buttonWidth=100;
	var buttonX=menuOffsetX+menuWidth/4/2-buttonWidth-margin/2+margin;
	var buttonXBefore=buttonX;
	
	generalMenu.addButton(buttonX, currY, buttonWidth, 30, "Send 1", callbackAdd.bind(null,-1));
	buttonX+=buttonWidth+margin;
	generalMenu.addButton(buttonX, currY, buttonWidth, 30, "Send 10", callbackAdd.bind(null,-10));
	
	buttonX=buttonXBefore;
	var currYBefore=currY;
	currY+=margin+30;
	
	generalMenu.addButton(buttonX, currY, buttonWidth, 30, "Send 100", callbackAdd.bind(null,-100));
	buttonX+=buttonWidth+margin;
	generalMenu.addButton(buttonX, currY, buttonWidth, 30, "Send 1000", callbackAdd.bind(null,-1000));
	
	currY=currYBefore;
	buttonX=menuOffsetX+menuWidth/4*3+menuWidth/4/2-buttonWidth-margin/2+margin;
	buttonXBefore=buttonX;
	
	generalMenu.addButton(buttonX, currY, buttonWidth, 30, "Get 1", callbackAdd.bind(null,1));
	buttonX+=buttonWidth+margin;
	generalMenu.addButton(buttonX, currY, buttonWidth, 30, "Get 10", callbackAdd.bind(null,10));
	
	buttonX=buttonXBefore;
	currY+=margin+30;
	
	generalMenu.addButton(buttonX, currY, buttonWidth, 30, "Get 100", callbackAdd.bind(null,100));
	buttonX+=buttonWidth+margin;
	generalMenu.addButton(buttonX, currY, buttonWidth, 30, "Get 1000", callbackAdd.bind(null,1000));
	buttonX+=buttonWidth+margin;
	
	currY+=30+margin;

	generalMenu.addLine(player1SendingLineX, startLine,player1SendingLineX,currY);
	generalMenu.addLine(player2SendingLineX, startLine,player2SendingLineX,currY);
	generalMenu.addLine(menuOffsetX+menuWidth/2+margin, menuOffsetY+margin,menuOffsetX+menuWidth/2+margin,currY);
	
	generalMenu.addLine(menuOffsetX+margin/2, currY,menuOffsetX+menuWidth+margin,currY);
	
	currY+=margin*2;
	
	var callbackClose=function()
	{
		generalMenu.hideAll(true);
		playerObj.setBusy(false);
		generalMenu.setBusy(false);
		enemyObj.setBusy(false);
		
		if(cancelCallback!=undefined)
		{
			cancelCallback();
		}
		return true;
	}
	
	var callbackOffer=function()
	{
		generalMenu.hideAll(true);
		playerObj.setBusy(false);
		generalMenu.setBusy(false);
		enemyObj.setBusy(false);
		
		if(offerCallback!=undefined)
		{
			offerCallback(offerArray,requestArray);
		}
		return true;
	}
	
	buttonX=menuOffsetX+menuWidth/4+margin*2;
	generalMenu.addButton(buttonX, currY, menuWidth/4-2*margin, 30, textOffer, callbackOffer);
	
	buttonX=menuOffsetX+menuWidth/4*2+margin*2;
	generalMenu.addButton(buttonX, currY, menuWidth/4-2*margin, 30, textCancel, callbackClose);
	
	currY+=30+margin;
	
	generalMenu.addMenuBackground(menuOffsetX-8,menuOffsetY-8,menuWidth+16+margin*2,currY-menuOffsetY+16,"","black",true);
	
	generalMenu.draw();
	return true;
}

function fieldInformationWindow(informationMenu, houseText1, houseText2, hypothekText, closeText, field, mortgageText, mortgageCallback)
{
	if(informationMenu.isBusy())
	{ 
		return true;
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
	
	var menuWidth=Math.max(width/4.5,300);
	
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
		return true;
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

function acceptTradeWindow(generalMenu, gameMap,sendingPlayer, receivingPlayer, otherPlayerOffers, otherPlayerRequests, yesCallback, noCallback)
{   
	if(generalMenu.isBusy())
	{
		return false;
	}
	
	generalMenu.setBusy(true);
	
	generalMenu.hideAll(false);
	generalMenu.setDraggable(true);
	generalMenu.clear();
	var width = window.innerWidth;
    var height = window.innerHeight;
	
	var menuWidth=400;
	
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
	
	var xMenu=width/2-menuWidth/2;
	var yMenu=height/6;
	var xPlayer1=xMenu+20;
	var xPlayer2=xMenu+menuWidth/2+20;
	var textFieldWidth=(menuWidth-80)/2;
	
	
	
	var tradeRequestText=generalMenu.addText(xPlayer1,10+yMenu,menuWidth-40, "Accept Trading-Offer?");
	var tradingAreaY=tradeRequestText.getHeight()+10;
	
	var sendingPlayerName=generalMenu.addTextInRect(xPlayer1,10+yMenu+tradingAreaY,menuWidth-40, sendingPlayer.getName(), sendingPlayer.getColor());
	tradingAreaY+=sendingPlayerName[0].getHeight()+20;
	
	var originaltradingAreaY=tradingAreaY
	
	var textOffers=generalMenu.addText(xPlayer1,tradingAreaY+yMenu+4,menuWidth/2-40, "Offers");
	generalMenu.addText(xPlayer2,tradingAreaY+yMenu+4,menuWidth/2-40, "Wants");

	tradingAreaY+=textOffers.getHeight()+4;
	
	generalMenu.addLine(xMenu+10, yMenu+tradingAreaY+8,xMenu+menuWidth-10, yMenu+tradingAreaY+8);
	
	
	var currHeight=tradingAreaY+20;
	var maxHeight=0;
	for(var i=0;i<otherPlayerOffers.streets.length;i++)
	{
		var currField=gameMap.getFieldById(otherPlayerOffers.streets[i]);
		var fieldNameOffer=generalMenu.addTextInRect(xPlayer1,currHeight+yMenu,textFieldWidth, currField.getText(), currField.getColor(),true);
		var fieldHeight=fieldNameOffer[0].getHeight();
		
		currHeight+=fieldHeight+8;
	}
	maxHeight=currHeight;
	
	currHeight=tradingAreaY+20;
	for(var i=0;i<otherPlayerRequests.streets.length;i++)
	{
		var currField=gameMap.getFieldById(otherPlayerRequests.streets[i]);
		var fieldNameRequest=generalMenu.addTextInRect(xPlayer2,currHeight+yMenu,textFieldWidth, currField.getText(), currField.getColor(),true);
		var fieldHeight=fieldNameRequest[0].getHeight();
		
		currHeight+=fieldHeight+8;
	}

	maxHeight=Math.max(maxHeight,currHeight);
	generalMenu.addLine(xMenu+10, yMenu+maxHeight+8,xMenu+menuWidth-10, yMenu+maxHeight+8);
	
	maxHeight+=8;
	var moneyText=undefined;
	if(otherPlayerOffers.money!=0)
	{
		moneyText=generalMenu.addText(xPlayer1,yMenu+maxHeight+8,menuWidth/2-40, otherPlayerOffers.money+" eg");
	}
	if(otherPlayerRequests.money!=0)
	{
		moneyText=generalMenu.addText(xPlayer2,yMenu+maxHeight+8,menuWidth/2-40, otherPlayerRequests.money+" eg");
	}
	
	if(moneyText!=undefined)
	{
		maxHeight+=moneyText.getHeight()+8;
	}
	else
	{
		maxHeight+=16;
	}
	
	
	generalMenu.addLine(xMenu+10, yMenu+maxHeight+4,xMenu+menuWidth-10, yMenu+maxHeight+4);
	
	generalMenu.addButton(xMenu+20, yMenu+maxHeight+16, 60, 30, "No", notOkCallbackHide, "");
	generalMenu.addButton(xMenu+menuWidth-20-60, yMenu+maxHeight+16, 60, 30, "Yes", okCallbackHide, "");
	
	generalMenu.addLine(xMenu+menuWidth/2, yMenu+originaltradingAreaY+8,xMenu+menuWidth/2,yMenu+maxHeight+16+30);
	
	generalMenu.addMenuBackground(xMenu,yMenu,menuWidth,maxHeight+58,"","black",true);
	
	generalMenu.draw();
}

function acceptWindow(generalMenu, text, yesCallback, noCallback, noButtonText, yesButtonText)
{   
	yesButtonText = typeof yesButtonText !== 'undefined' ? yesButtonText : "Yes";
	noButtonText = typeof noButtonText !== 'undefined' ? noButtonText : "No";
	
	if(generalMenu.isBusy())
	{
		return false;
	}
	
	generalMenu.setBusy(true);
	
	generalMenu.hideAll(false);
	generalMenu.setDraggable(false);
	generalMenu.clear();
	var width = window.innerWidth;
    var height = window.innerHeight;
	
	var menuWidth=Math.min(Math.max(text.length*4,250),500);
	
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
	
	generalMenu.addMenuBackground(width/2-menuWidth/2,height/3,menuWidth,textObj.getHeight()+74,"","black");
	
	if(yesButtonText!="" && noButtonText!="")
	{
		generalMenu.addButton(width/2-menuWidth/2+20, height/3+textObj.getHeight()+32, 100, 30, yesButtonText, okCallbackHide, "");
		generalMenu.addButton(width/2+menuWidth/2-120, height/3+textObj.getHeight()+32, 100, 30, noButtonText, notOkCallbackHide, "");
	}
	else if(yesButtonText!="")
	{
		generalMenu.addButton(width/2-50, height/3+textObj.getHeight()+32, 100, 30, yesButtonText, okCallbackHide, "");
	}
	else if(noButtonText!="")
	{
		generalMenu.addButton(width/2-50, height/3+textObj.getHeight()+32, 100, 30, noButtonText, notOkCallbackHide, "");
	}
	
	generalMenu.draw();
}

function setUpStandardMenu(ingameMenu, diceMenu, generalMenu, gameMap, user, enemyArray, buildingMenuCallback, endTurnCallback, buyFieldCallback, sendTradeRequestCallback)
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
	ingameMenu.addImage(profileImageMargin, profileImageMargin, profileImageSize, profileImageSize, user.imgSrc,user.getColor());

	var textMoney=ingameMenu.addText(profileImageMargin, profileImageMargin+profileImageSize, profileImageSize, "1500 "+GLOBAL_MONEY_VAR);
	user.setMoneyTextbox(textMoney);

	ingameMenu.addButton(containerWidth/2+30, 0, 60, 30, "»", gameMap.rotateRight, "Rotate whole map by +90°");
	ingameMenu.addButton(containerWidth/2-30, 0, 60, 30, "«", gameMap.rotateLeft, "Rotate whole map by -90°");

	user.createCardManager(ingameMenu, containerWidth/4, containerHeight-124, 100, 140);

	var textMoneyEnemy;
	for(var i=0;i<enemyArray.length;i++)
	{
		var x=containerWidth-profileImageMargin-profileImageSizeEnemy;
		var y=(margin+profileImageSizeEnemy+68)*i+marginHeight;
		ingameMenu.addMenuBackground(x, y, profileImageSizeEnemy, profileImageSizeEnemy+30);
		ingameMenu.addImage(x, y, profileImageSizeEnemy, profileImageSizeEnemy, enemyArray[i].imgSrc,enemyArray[i].getColor());

		textMoneyEnemy=ingameMenu.addText(x, y+profileImageSizeEnemy, profileImageSizeEnemy, "1500 "+GLOBAL_MONEY_VAR);
		enemyArray[i].setMoneyTextbox(textMoneyEnemy);
		
		ingameMenu.addButton(x+16, y+profileImageSizeEnemy+8+textMoneyEnemy.getHeight(), profileImageSizeEnemy-32, 30, "Trade", tradingWindow.bind(null, generalMenu,user,enemyArray[i],"Offer", "Cancel",sendTradeRequestCallback), "Start a trade with this player");
	}
	
	ingameMenu.addButton(profileImageMargin, profileImageMargin+profileImageSize+16+textMoney.getHeight(), profileImageSize, 30, "Building Menu", buildingMenuCallback, "Opens menu to buy and sell houses");

	ingameMenu.addButton(profileImageMargin, profileImageMargin+profileImageSize+38+16+textMoney.getHeight(), profileImageSize, 30, "End Turn", endTurnCallback, "Ends the current turn");

	function buyField(player)
	{
		if(player.isBusy() || player.isMoving())
		{
			return true;
		}

		if(buyFieldCallback!=undefined)
		{
			buyFieldCallback(player.getCurrentField().getId());
		}
		return true;
	}
	
	var buyCallback=buyField.bind(null,user);
	var buyButton=ingameMenu.addButton(profileImageMargin, profileImageMargin+profileImageSize+76+16+textMoney.getHeight(), profileImageSize, 30, "Buy Field", buyCallback, "Buy the field you are at");

	var dices=[[],[]];
	
	for(var i=0;i<6;i++)
	{
		dices[0].push(diceMenu.addImage(profileImageMargin+profileImageSize/2-54, profileImageMargin+profileImageSize+112+16+textMoney.getHeight(), 50, 50,"img/dice/d"+(i*1+1)+".png"));
	}
	
	for(var i=0;i<6;i++)
	{
		dices[1].push(diceMenu.addImage(profileImageMargin+profileImageSize/2+4, profileImageMargin+profileImageSize+112+16+textMoney.getHeight(), 50, 50,"img/dice/d"+(i*1+1)+".png"));
	}
	
	return {buyButton: buyButton, dices: dices};
	/*
	var boundAlert2=myAlert.bind(null,"Yay, you clicked Field Card 'Last Chaos'!");
	ingameMenu.addFieldCard(50, 80, 70, 80, "Last Chaos", "lightblue", boundAlert2,"./img/streets/2_mmorpg/2_last_chaos.jpg");
	*/
}