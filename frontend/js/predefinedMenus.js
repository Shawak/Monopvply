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
	
	var textMoney=ingameMenu.addText(profileImageMargin, profileImageMargin+profileImageSize, profileImageSize, "1500 e*gold");
	user.setMoneyTextbox(textMoney);
		
	ingameMenu.addButton(containerWidth/2+50, margin, 70, 30, ">>", gameMap.rotateRight, "Rotate whole map by +90°");
	ingameMenu.addButton(containerWidth/2-50, margin, 70, 30, "<<", gameMap.rotateLeft, "Rotate whole map by -90°");
	
	
	for(var i=0;i<enemyArray.length;i++)
	{
		var x=containerWidth-profileImageMargin-profileImageSizeEnemy;
		var y=(margin+profileImageSizeEnemy+30)*(i+1);
		ingameMenu.addMenuBackground(x, y, profileImageSizeEnemy, profileImageSizeEnemy+30);
		ingameMenu.addImage(x, y, profileImageSizeEnemy, profileImageSizeEnemy, enemyArray[i].imgSrc);
	
		var textMoneyEnemy=ingameMenu.addText(x, y+profileImageSizeEnemy, profileImageSizeEnemy, "1500 e*gold");
		enemyArray[i].setMoneyTextbox(textMoneyEnemy);
	}

	/*
	var boundAlert2=myAlert.bind(null,"Yay, you clicked Field Card 'Last Chaos'!");
	ingameMenu.addFieldCard(50, 80, 70, 80, "Last Chaos", "lightblue", boundAlert2,"./img/streets/2_mmorpg/2_last_chaos.jpg");
	*/
	
	var myAlert=function(txt)
	{
		alert(txt);
	}
	var boundAlert2=myAlert.bind(null,"Yay, you clicked Field Card 'Tera'!");
	ingameMenu.addFieldCard(containerWidth/2-50, containerHeight-140-marginHeight, 100, 140, "Tera", "lightblue", boundAlert2,"./img/streets/2_mmorpg/3_tera.jpg");
	
	var myAlert=function(txt)
	{
		alert(txt);
	}
	var boundAlert3=myAlert.bind(null,"Yay, you clicked Field Card 'Last Chaos'!");
	ingameMenu.addFieldCard(containerWidth/2-50+50, containerHeight-140-marginHeight, 100, 140, "Last Chaos", "lightblue", boundAlert3,"./img/streets/2_mmorpg/2_last_chaos.jpg");
}