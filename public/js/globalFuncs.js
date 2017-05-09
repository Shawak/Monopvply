window.isMobileDevice = function() 
{
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function addOneHouseInBuildingMenu(layer, field, houseRects, textObj, originalMoney, originalHouses, playerObj)
{
	var currMoney=playerObj.getMoney();
	var newMoney;
	if(originalHouses<=field.getHouses())
	{
		newMoney=currMoney-field.getHouseCosts();
	}
	else
	{
		newMoney=currMoney-field.getHouseWorth();
	}
	
	if(newMoney<0)
	{
		return;
	}
	
	var success=field.addHouse(1);
	if(!success)
	{
		return;
	}
	
	var houses=field.getHouses();
	
	for(var i=0;i<houses && i<houseRects.length;i++)
	{
		houseRects[i].fill("gray");
		houseRects[i].draw();
	}
	
	for(var i=houses;i<houseRects.length;i++)
	{
		houseRects[i].fill("white");
		houseRects[i].draw();
	}
	
	if(newMoney>=originalMoney)
	{
		animationColor="green";
	}
	else
	{
		animationColor="red";
	}
	
	textObj.text(newMoney+" eg");
	textObj.fill(animationColor);
	playerObj.setMoney(newMoney);
	layer.draw();
}

function sellOneHouseInBuildingMenu(layer, field, houseRects, textObj, originalMoney, originalHouses, playerObj)
{
	var currMoney=playerObj.getMoney();
	var newMoney;

	if(originalHouses<field.getHouses())
	{
		newMoney=currMoney+field.getHouseCosts();
	}
	else
	{
		newMoney=currMoney+field.getHouseWorth();
	}
	
	var success=field.addHouse(-1);
	
		
	if(!success)
	{
		return;
	}
	var houses=field.getHouses();
	
	for(var i=0;i<houses && i<houseRects.length;i++)
	{
		houseRects[i].fill("gray");
		houseRects[i].draw();
	}
	
	for(var i=houses;i<houseRects.length;i++)
	{
		houseRects[i].fill("white");
		houseRects[i].draw();
	}
	
	if(newMoney>=originalMoney)
	{
		animationColor="green";
	}
	else
	{
		animationColor="red";
	}
	
	textObj.text(newMoney+" eg");
	textObj.fill(animationColor);
	playerObj.setMoney(newMoney);
	layer.draw();
}

function nextTurnState(packet,ingameMenu,user)
{
	if(user==undefined || packet==undefined)
	{
		return false;
	}
	
	if(packet.player.id==user.getId())
	{
		// Next user is YOU, so enable everything
		ingameMenu.enableAllButtons();
	}
	else
	{
		// Enemys turn, disable everything
		ingameMenu.disableAllButtons();
	}
	
	return true;
}

function updatePlayerState(packet,user, enemies)
{	
	if(user==undefined || packet==undefined || enemies==undefined)
	{
		return false;
	}
	
	for(var i=0;i<enemies.length;i++)
	{
		if(packet.player.id==enemies[i].getId())
		{
			return enemies[i].updateState(packet.player);
		}
	}
	
	if(packet.player.id==user.getId())
	{
		return user.updateState(packet.player);
	}
	
	return true;
}

function showDice(dices, num1, num2)
{
	for(var i=0;i<dices[0].length;i++)
	{
		dices[0][i].hide();
		dices[1][i].hide();
	}

	dices[0][num1-1].show();
	dices[1][num2-1].show();
}

function updateDiceState(packet, diceMenu, dices, user, enemies)
{
	if(user==undefined || packet==undefined || enemies==undefined)
	{
		return false;
	}
	
	// Show dice result
	showDice(dices, packet.rollResult[0], packet.rollResult[1]);
	diceMenu.draw();
	
	return true;
}

function addChatMessage(playerName, playerImg, text)
{
	var htmlMessage='<li class="left clearfix">';
	if(playerImg!="")
	{
		htmlMessage+='<span class="chat-img pull-left"><img src="'+playerImg+'" alt="" class="img-circle" style="width:40px;height:40px;"/></span>';
	}
	htmlMessage+='<div class="chat-body clearfix"><div class="header"><strong class="primary-font">'+playerName+'</strong></div>';
	htmlMessage+='<p>'+text+'</p></div></li>';
	
	var chatMsgs=document.getElementById("chatMsgs");
	chatMsgs.innerHTML+=htmlMessage;
	var chatBody=document.getElementById("chatBody");
	chatBody.scrollTop = chatBody.scrollHeight;
	document.getElementById("newMessage").innerHTML="<div style='font-weight: bold;'>(!)</div>";
}
			
function updateFieldState(packet,user, enemies)
{	
	var ownerBefore=undefined;

	if(packet.owner!==null)
	{
		for(var i=0;i<enemies.length;i++)
		{
			if (enemies[i].ownsField(packet.field.id))
			{
				ownerBefore=enemies[i];
				break;
			}
		}
		
		if (user.ownsField(packet.field.id))
		{
			ownerBefore=user;
		}	
		
		if(ownerBefore!=undefined)
		{
			ownerBefore.setCharged(packet.field.id,packet.field.mortgaged);
		}
	}
	
	
	if(packet.field.houses==0 && packet.field.owner!==null && (ownerBefore==undefined ||  (packet.owner!==undefined && packet.owner!==null && ownerBefore.getId()!=packet.owner.id)))
	{
		for(var i=0;i<enemies.length;i++)
		{
			if(packet.field.owner.id==enemies[i].getId())
			{
				if (enemies[i].ownsField(packet.field.id)==false)
				{
						if(ownerBefore!=undefined)
						{
							ownerBefore.removeCard(packet.field.id);
						}
						return enemies[i].addCard(packet.field.id);
				}
			}
		}
		
		if(packet.field.owner.id==user.getId())
		{
			if (user.ownsField(packet.field.id)==false)
			{
				if(ownerBefore!=undefined)
				{
					ownerBefore.removeCard(packet.field.id);
				}
				return user.addCard(packet.field.id);
			}
		}
	}
	else if(packet.field.owner!==null && packet.owner!==undefined && packet.owner!==null && ownerBefore!=undefined && ownerBefore.getId()==packet.owner.id)
	{
		var field=ownerBefore.getFieldById(packet.field.id);
		if(field!=undefined)
		{
			field.setHouses(packet.field.houses);
		}
	}
	
	return true;
}