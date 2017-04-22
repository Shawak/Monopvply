
function setUpStandardMap(packet, queueManager, gameMap, informationMenu)
{
	if(packet.field.length%4!=0)
	{
		return false;
	}
	
	var cornerModulo=packet.field.length/4;
	for(var i=0; i<packet.field.length;i++)
	{
		var currField=packet.field[i];
		if(i%cornerModulo==0)
		{
			gameMap.addCornerField(new Field(queueManager,currField.id,-1,currField.img, "", currField.name, 0, 0,""));
		}
		else
		{
			var field=new Field(queueManager,currField.id,currField.group,currField.img, currField.color, currField.name, currField.price || currField.tax ,currField.priceHouse,currField.mortgageRatio,undefined,currField.priceTextColor,currField.textColor);
			gameMap.addSideField(field);
			if(packet.field.rents!=undefined)
			{
				field.setRent(packet.field.rents);
			}
			
		}
	}
	
	gameMap.setUp();
	
	var fields=gameMap.getSideFields();
	for(var i=0;i<fields.length;i++)
	{
		if(fields[i].getGroup()>-1)
		{
			var cardInfo=fieldInformationWindow.bind(null,informationMenu, GLOBAL_MORTGAGE_FOR_TEXT, GLOBAL_HOUSES_TEXT, GLOBAL_MORTGAGE_ACTION_TEXT, GLOBAL_CLOSE_TEXT, fields[i]);
			fields[i].onClick(cardInfo);
		}

	}
	return true;
}