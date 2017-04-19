   
function Field(queueManager,id, streeGroup,imageSrc, fillColor, text, costs, costsPerHouse, sellPerHouseRatio, hypothekRatio , onClickCallback, costsColor, textColor)
{
	sellPerHouseRatio = typeof sellPerHouseRatio !== 'undefined' ? sellPerHouseRatio : 0.90;
	hypothekRatio = typeof hypothekRatio !== 'undefined' ? hypothekRatio : 0.90;
	onClickCallback = typeof onClickCallback !== 'undefined' ? onClickCallback : undefined;
	costsColor = typeof costsColor !== 'undefined' ? costsColor : '#FFF';
	textColor = typeof textColor !== 'undefined' ? textColor : "#DDD";
	costs = typeof costs !== 'undefined' ? costs : 0;
	fillColor = typeof fillColor !== 'undefined' ? fillColor : "";

	var queueManager=queueManager;
	var rect;
	var img;
	var imageSrc=imageSrc;
	var fillColor=fillColor;
	var onClickCallback=onClickCallback;
	var costs=costs;
	var hypothekWorth=costs*hypothekRatio;
	var text=text;
	var fieldText;
	var rectText;
	var fieldCosts;
	var fieldX;
	var fieldY;
	var id=id;
	var streeGroup=streeGroup;
	var amountHouses=0;
	var maxHouses=5;
	var costsPerHouse=costsPerHouse;
	var sellPerHouse=(costsPerHouse*sellPerHouseRatio)|0;
	var rent=[0,0,0,0,0];
	var colisionRect;
	var charged=false;
	var chargeObj;
	var fieldGroup;
	var layer;
	var parentLayer;
	var buyable=true;
	var highPerformance=true;
	
	this.setHighPerformanceMode=function(performance)
	{
		highPerformance=performance;
	}
	
	this.isBuyable =function()
	{
		return buyable;
	}
	
	this.setBuyable=function(buy)
	{
		buyable=buy;
	}
	
	this.onClick =function(callback)
	{
		onClickCallback=callback;
				
		var clickAction=function(evt)
		{
			evt.cancelBubble = true;
			if(onClickCallback!=undefined && onClickCallback!="")
			{
				queueManager.add(onClickCallback);
			}
		};
		colisionRect.on("click", clickAction);
	}
	
	this.isCharged = function()
	{
		return charged;
	}
	
	this.setCharged = function(charge)
	{
		if(charge==true)
		{
			chargeObj.show();
		}
		else
		{
			chargeObj.hide();
		}
		fieldGroup.cache();
		layer.cache();
		layer.draw();
		parentLayer.draw();
		charged=charge;
	}
	
	this.getRent = function () 
	{
        return rent;
    };
	
	this.getHypothekWorth = function () 
	{
        return hypothekWorth;
    };
	
	this.getHouseCosts = function (amount) 
	{
        return costsPerHouse;
    };
	
	this.getHouseWorth = function (amount) 
	{
        return sellPerHouse;
    };
	
	this.addHouse = function (amount) 
	{
		if(amountHouses+amount<=maxHouses && amountHouses+amount>=0)
		{
			amountHouses+=amount;
			return true;
		}
        return false;
    };
	
	this.getHouses = function () {
        return amountHouses;
    };
	
	this.setHouses = function (houses) {
        amountHouses=houses;
    };
	
	this.getGroup=function()
	{
		return streeGroup;
	}

	this.getX=function()
	{
		return fieldX;
	}

	this.getY=function()
	{
		return fieldY;
	}

	this.getImgObj = function()
	{
		return img;
	}

	this.getText =function()
	{
		return text;
	}
	
	this.getId =function()
	{
		return id;
	}
		
	this.getImgSrc =function()
	{
		return imageSrc;
	}
	
	this.getCosts =function()
	{
		return costs;
	}
	
	this.getColor =function()
	{
		return fillColor;
	}
	
	this.construct = function (parentParentLayer,parentLayerIn,konvaLayer, x, y, width, height, side, corner, callback)
	{
		layer=parentLayerIn;
		parentLayer=parentParentLayer;
		callback = typeof callback !== 'undefined' ? callback : undefined;
		
		fieldX=x;
		fieldY=y;

		corner = typeof corner !== 'undefined' ? corner : false;
		
		var heightRect;
		var widthRect;
		
		var xRect;
		var yRect;
		
		var heightImg;
		var widthImg;
		
		var xImg;
		var yImg;
		
		var strokeWidth=3;
		var rotationImg;
		
		if(fillColor!="")
		{
			heightRect=height/5;
			widthRect=width;
			
			xRect=x;
			yRect=y;
		}
		else
		{
			heightRect=0;
			widthRect=0;
		}
		heightImg=height-heightRect;
		widthImg=width;
		
		xImg=x;
		yImg=y+heightRect;
		
		if(side=="top")
		{
			x+=width;
			y+=height;
			rotationImg=180;
		}
		else if(side=="left")
		{
			x+=height;
			rotationImg=90;
		}
		else if(side=="bottom")
		{

			rotationImg=0;
		}
		else if(side=="right")
		{
			y+=width;
			rotationImg=270;
		}
		
		fieldGroup=new Konva.Group(
		{
			x: x,
			y: y,
			width: width,
            height: height+16,
			rotation: rotationImg
		});
		
		if(fillColor!="")
		{
			rect=new Konva.Rect(
			{
				x: 0,
				y: 0,
				width: widthRect,
				height: heightRect,
				fill: fillColor,
				stroke: 'black',
				strokeWidth: strokeWidth,
				listening: false
			});
			
			fieldGroup.add(rect);
		}
		
		var imageObj = new Image();
		imageObj.src = imageSrc;
		
		imageObj.onload=function()
		{
			fieldGroup.cache(
			{
			  x: 0.00001,
			  y: 0.00001,
			  width: width,
			  height: height
			});
		};
		
		img = new Konva.Image(
		{
            image: imageObj,
            x: 0,
            y: heightRect,
            width: widthImg,
            height: heightImg,
			stroke: 'black',
			strokeWidth: strokeWidth,
			listening: false
        });
		
		// add the shapes to the layer
		fieldGroup.add(img);
		
		chargeObj = new Konva.Text(
		{
            x: Math.max(width/2-24,0),
            y: 0,
            width: widthImg,
            height: heightImg,
			text: GLOBAL_MORTGAGE_FIELD_TEXT,
			fontSize: 34,
			fontFamily: 'Calibri',
			fontStyle: "bold",
			fill: "#cc0000",
			width:Math.sqrt(widthImg*widthImg+heightImg*heightImg),
			padding: 4,
			rotation: 65,
			align: 'center',
			strokeWidth: 1,
			perfectDrawEnabled : false,
			listening:false,
			shadowColor: (highPerformance==true) ? undefined : "black",
			shadowBlur: (highPerformance==true) ? undefined : 4,
			shadowOffset: (highPerformance==true) ? undefined : [10, 10],
			id: 'chargeObj'
		});
		chargeObj.hide();
		fieldGroup.add(chargeObj);
		
		var marginSide=10;
		addText(fieldGroup,0 , heightRect, widthImg,marginSide, corner);
		if(corner==false)
		{
			addCosts(fieldGroup, 0, heightRect, widthImg-marginSide*2, heightImg ,marginSide);
		}
			
		colisionRect = new Konva.Rect(
		{
            x: 0,
            y: 0,
            width: width,
            height: height+16
		});
		
		var changePointerEnter=function()
		{
			document.body.style.cursor = 'help';
		};
		
		var changePointerOut=function()
		{
			document.body.style.cursor = 'default';
		};
		
		var clickAction=function(evt)
		{
			evt.cancelBubble = true;
			if(onClickCallback!=undefined && onClickCallback!="")
			{
				queueManager.add(onClickCallback);
			}
		};
		
		colisionRect.on("mouseout", changePointerOut);
		colisionRect.on("mouseenter", changePointerEnter);
		colisionRect.on("click", clickAction);
		fieldGroup.add(colisionRect);
		konvaLayer.add(fieldGroup);
		
		chargeObj.moveToTop();
		colisionRect.moveToTop();
		
	}
	
	function addText(konvaLayer,x, y, width, marginSide, corner)
	{
		if(text=="")
		{
			return;
		}
		
		var marginSideY=marginSide;
		var newWidth=Math.min(width-marginSide*2,text.length*20);
		
		if(!corner)
		{
			marginSide=(width-newWidth)/2;
		}
		else
		{
			newWidth=width-2*marginSide;
		}
		
		var rotation=0;
		if(corner)
		{
			rotation-=45;
			marginSideY=width-width/4;
		}
		y+=marginSideY;
		x+=marginSide;
	
		// since this text is inside of a defined area, we can center it using
		// align: 'center'
		fieldText = new Konva.Text(
		{
			x: x,
			y: y,
			text: text,
			fontSize: 18,
			fontFamily: 'Calibri',
			fill: textColor,
			width: newWidth,
			padding: 8,
			align: 'center',
			rotation: rotation,
			listening:false
		});
		rectText = new Konva.Rect(
		{
			x: x,
			y: y,
			stroke: '#999',
			strokeWidth: 3,
			fill: '#262626',
			width: newWidth,
			height: fieldText.getHeight(),
			opacity: (highPerformance==true) ? undefined : 0.7,
			cornerRadius: (highPerformance==true) ? undefined : 10,
			rotation: rotation,
			listening:false,
			perfectDrawEnabled : false
		});
		konvaLayer.add(rectText);
		konvaLayer.add(fieldText);
	}
	
	function addCosts(konvaLayer,x, y, width, height, marginSide)
	{
		if(costs<=0)
		{
			return;
		}
		
		var marginBot=44;
		
			y+=height-marginBot;
			x+=marginSide;
		
		
		fieldCosts = new Konva.Text(
		{
			x: x,
			y: y,
			text: costs+" "+GLOBAL_MONEY_VAR,
			fontSize: 22,
			fontFamily: 'Calibri',
			fill: costsColor,
			shadowColor: (highPerformance==true) ? undefined : "black",
			shadowBlur: (highPerformance==true) ? undefined : 4,
			shadowOffset: (highPerformance==true) ? undefined : [10, 10],
			shadowOpacity: (highPerformance==true) ? undefined : 0.9,
			width: width,
			padding: 8,
			align: 'center',
			listening:false
		});
		
		konvaLayer.add(fieldCosts);
	}
	
	this.setPosition = function(x,y)
	{
		
	}
}
   

