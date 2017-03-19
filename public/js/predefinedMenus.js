

function acceptWindow(generalMenu, text, yesCallback, noCallback)
{   
	var width = window.innerWidth;
    var height = window.innerHeight;
	
	var menuWidth=Math.max(text.length*5,150);
	
	var okCallbackHide=function()
	{
		generalMenu.hideAll(true);
		if(yesCallback!=undefined)
		{
			yesCallback();
		}
	}
	
	var notOkCallbackHide=function()
	{
		generalMenu.hideAll(true);
		if(noCallback!=undefined)
		{
			noCallback();
		}
	}
	
	var textObj=generalMenu.addText(width/2-menuWidth/2+8,height/3+8,menuWidth-16,text);
	
	generalMenu.addMenuBackground(width/2-menuWidth/2,height/3,menuWidth,textObj.getHeight()+58);
	
	generalMenu.addButton(width/2-menuWidth/2+20, height/3+textObj.getHeight()+16, 60, 30, "Yes", okCallbackHide, "");
	generalMenu.addButton(width/2+menuWidth/2-80, height/3+textObj.getHeight()+16, 60, 30, "No", notOkCallbackHide, "");
	
	generalMenu.getLayer().draw();
}

function setUpStandardMenu(ingameMenu, gameMap, user, enemyArray)
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
	
	var textMoney=ingameMenu.addText(profileImageMargin, profileImageMargin+profileImageSize, profileImageSize, "1500 eg");
	user.setMoneyTextbox(textMoney);
		
	ingameMenu.addButton(containerWidth/2+50, margin, 70, 30, ">>", gameMap.rotateRight, "Rotate whole map by +90°");
	ingameMenu.addButton(containerWidth/2-50, margin, 70, 30, "<<", gameMap.rotateLeft, "Rotate whole map by -90°");
	
	user.createCardManager(containerWidth/4, containerHeight-140-marginHeight, 100, 140);
	
	for(var i=0;i<enemyArray.length;i++)
	{
		var x=containerWidth-profileImageMargin-profileImageSizeEnemy;
		var y=(margin+profileImageSizeEnemy+30)*(i+1);
		ingameMenu.addMenuBackground(x, y, profileImageSizeEnemy, profileImageSizeEnemy+30);
		ingameMenu.addImage(x, y, profileImageSizeEnemy, profileImageSizeEnemy, enemyArray[i].imgSrc);
	
		var textMoneyEnemy=ingameMenu.addText(x, y+profileImageSizeEnemy, profileImageSizeEnemy, "1500 eg");
		enemyArray[i].setMoneyTextbox(textMoneyEnemy);
	}

	/*
	var boundAlert2=myAlert.bind(null,"Yay, you clicked Field Card 'Last Chaos'!");
	ingameMenu.addFieldCard(50, 80, 70, 80, "Last Chaos", "lightblue", boundAlert2,"./img/streets/2_mmorpg/2_last_chaos.jpg");
	*/
}