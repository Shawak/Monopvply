   
function Field(imageSrc, fillColor, text, costs , onClickCallback=undefined, buyable=true)
{
	var rect;
	var img;
	var imageSrc=imageSrc;
	var fillColor=fillColor;
	var onClickCallback=onClickCallback;
	var buyable=buyable;
	var costs=costs;
	var text=text;
	var fieldText;
	var rectText;
	var fieldCosts;
	
	this.construct = function (konvaLayer, x, y, width, height, side, corner=false)
	{
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
		
		if(side=="top")
		{
			if(buyable)
			{
				heightRect=height/5;
				widthRect=width;
				
				xRect=x;
				yRect=y+height-heightRect;
			}
			else
			{
				heightRect=0;
				widthRect=0;
			}
			
			heightImg=height-heightRect;
			widthImg=width;
			
			xImg=x+width;
			yImg=y+heightImg;
			
			rotationImg=180;
		}
		else if(side=="left")
		{
			if(buyable)
			{
				heightRect=width;
				widthRect=height/5;
				
				xRect=x+height-widthRect;
				yRect=y;
			}
			else
			{
				heightRect=0;
				widthRect=0;
			}
			heightImg=height-widthRect;
			widthImg=width;
			
			xImg=x+height-widthRect;
			yImg=y;
			
			rotationImg=90;
		}
		else if(side=="bottom")
		{
			if(buyable)
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
			rotationImg=0;
		}
		else if(side=="right")
		{
			if(buyable)
			{
				heightRect=width;
				widthRect=height/5;
				
				xRect=x;
				yRect=y;
			}
			else
			{
				heightRect=0;
				widthRect=0;
			}
			heightImg=height-widthRect;
			widthImg=width;
			
			xImg=x+widthRect;
			yImg=y+width;
			
			rotationImg=270;
		}
		
		if(buyable)
		{
			rect=new Konva.Rect(
			{
				x: xRect,
				y: yRect,
				width: widthRect,
				height: heightRect,
				fill: fillColor,
				stroke: 'black',
				strokeWidth: strokeWidth
			});
					
			rect.on("click", function()
			{
				if(onClickCallback!=undefined && onClickCallback!="")
				{
					onClickCallback();
				}
			});
			
			konvaLayer.add(rect);
		}
		
		var imageObj = new Image();
		imageObj.src = imageSrc;
		
		img = new Konva.Image(
		{
            image: imageObj,
            x: xImg,
            y: yImg,
            width: widthImg,
            height: heightImg,
			rotation: rotationImg,
			stroke: 'black',
			strokeWidth: strokeWidth
        });
		
		img.on("click", function()
		{
			if(onClickCallback!=undefined && onClickCallback!="")
			{
				onClickCallback();
			}
		});
		
		// add the shapes to the layer
		konvaLayer.add(img);
		
		var marginSide=10;
		addText(konvaLayer, xImg, yImg, widthImg-marginSide*2,marginSide, rotationImg, side, corner);
		if(corner==false)
		{
			addCosts(konvaLayer, xImg, yImg, widthImg-marginSide*2, heightImg ,marginSide, rotationImg, side);
		}
	}
	
	function addText(konvaLayer,x, y, width, marginSide, rotation, side, corner)
	{
		if(text=="")
		{
			return;
		}
		
		var marginSideY=marginSide;

		if(side=="top")
		{
			if(corner)
			{
				rotation-=45;
				marginSideY=width-width/4;
			}
			y-=marginSideY;
			x-=marginSide;
		}
		else if(side=="left")
		{
			if(corner)
			{
				rotation-=45;
				marginSide=width-width/4;
			}
			y+=marginSideY;
			x-=marginSide;
		}
		else if(side=="bottom")
		{
			if(corner)
			{
				rotation-=45;
				marginSideY=width-width/4;
			}
			y+=marginSideY;
			x+=marginSide;
		}
		else if(side=="right")
		{
			if(corner)
			{
				rotation-=45;
				marginSide=width-width/4;
			}
			y-=marginSideY;
			x+=marginSide;
		}
		
		// since this text is inside of a defined area, we can center it using
		// align: 'center'
		fieldText = new Konva.Text(
		{
			x: x,
			y: y,
			text: text,
			fontSize: 18,
			fontFamily: 'Calibri',
			fill: '#DDD',
			width: width,
			padding: 8,
			align: 'center',
			rotation: rotation
		});
		rectText = new Konva.Rect(
		{
			x: x,
			y: y,
			stroke: '#999',
			strokeWidth: 5,
			fill: '#262626',
			width: width,
			height: fieldText.getHeight(),
			shadowColor: 'black',
			shadowBlur: 10,
			shadowOffset: [10, 10],
			shadowOpacity: 0.2,
			opacity:0.8,
			cornerRadius: 10,
			rotation: rotation
		});
		
		konvaLayer.add(rectText);
		konvaLayer.add(fieldText);
	}
	
	function addCosts(konvaLayer,x, y, width, height, marginSide, rotation, side)
	{
		if(costs==0)
		{
			return;
		}
		
		var marginBot=44;
		if(side=="top")
		{
			y-=height-marginBot;
			x-=marginSide;
		}
		else if(side=="left")
		{
			y+=marginSide;
			x-=height-marginBot;
		}
		else if(side=="bottom")
		{
			y+=height-marginBot;
			x+=marginSide;
		}
		else if(side=="right")
		{
			y-=marginSide;
			x+=height-marginBot;
		}
		
		fieldCosts = new Konva.Text(
		{
			x: x,
			y: y,
			text: costs+" e*gold",
			fontSize: 22,
			fontFamily: 'Calibri',
			fill: '#FFF',
			width: width,
			padding: 8,
			align: 'center',
			rotation: rotation
		});
		
		konvaLayer.add(fieldCosts);
	}
	
	this.setPosition = function(x,y)
	{
		
	}
}
   

