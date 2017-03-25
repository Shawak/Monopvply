
function Menu(konvaStage,queueManager,fillColorMenu,strokeColorMenu,buttonColor,strokeColor,textColor,hoverColor,clickColor)
{
	var queueManager=queueManager;
	var stage=konvaStage;
	var layer;
	var tooltipLayer;
	var buttonColor=typeof buttonColor !== 'undefined' ? buttonColor : '#999';
	var strokeColor=typeof strokeColor !== 'undefined' ? strokeColor : '#262626';
	var textColor=typeof textColor !== 'undefined' ? textColor : '#FFF';
	var hoverColor=typeof hoverColor !== 'undefined' ? hoverColor : "#888";
	var clickColor=typeof clickColor !== 'undefined' ? clickColor : "#555";
	var fillColorMenu=typeof fillColorMenu !== 'undefined' ? fillColorMenu : "#CCC";
	var strokeColorMenu=typeof strokeColorMenu !== 'undefined' ? strokeColorMenu : strokeColor;
	var groupDrag;
	var busy=false;
	
	init();
	
	function init()
	{
		layer = new Konva.Layer();
		tooltipLayer = new Konva.Layer();
		groupDrag= new Konva.Group();
        stage.add(layer);
		stage.add(tooltipLayer);
		layer.moveToTop();
		tooltipLayer.moveToTop();
		layer.add(groupDrag);
	}
	
	this.setBusy = function(state)
	{
		busy=state;
	}
	
	this.isBusy = function()
	{
		return busy;
	}
	
	this.cache = function()
	{
		groupDrag.cache();
	}
	
	this.setDraggable = function(draggable)
	{
		groupDrag.draggable(draggable);
	}
	
	this.getLayer = function()
	{
		return layer;
	}
	
	this.draw = function()
	{
		layer.draw();
	}

	this.clear = function()
	{
		groupDrag.destroyChildren();
		groupDrag.clearCache();
	}
	
	this.hideAll = function (hide)
	{
		if(hide==false)
		{
			layer.show();
			tooltipLayer.show();
			layer.draw();
			tooltipLayer.draw();
		}
		else
		{
			layer.hide();
			tooltipLayer.hide();
		}
	}
	
	this.addImage = function(x, y, width, height, imgSrc)
	{
		var imageObj = new Image();
		imageObj.src = imgSrc;
		
		var img = new Konva.Image(
		{
			image: imageObj,
			x: x,
			y: y,
			align: 'center',
			width: width,
			height: height,
			listening : false,
			opacity: 0.9,
			cornerRadius: 4,
			stroke: strokeColorMenu,
			strokeWidth: 1,
			perfectDrawEnabled : false,
				transformsEnabled : 'position'
		});
	
		groupDrag.add(img);
		return img;
	}
	
	this.addMenuBackground = function(x, y, width, height, imgSrc, color,listening)
	{
		imgSrc = typeof imgSrc !== 'undefined' ? imgSrc : "";
		color = typeof color !== 'undefined' ? color : fillColorMenu;
		listening = typeof listening !== 'undefined' ? listening : false;
		
		var menuBackground;
		
		if(imgSrc!="")
		{
			var imageObj = new Image();
			imageObj.src = imgSrc;
			
			menuBackground = new Konva.Image(
			{
				image: imageObj,
				x: x,
				y: y,
				align: 'center',
				width: width,
				height: height,
				listening : listening,
				opacity: 0.9,
				cornerRadius: 4,
				stroke: strokeColorMenu,
				strokeWidth: 1,
				perfectDrawEnabled : false,
				transformsEnabled : 'position'
			});
		}
		else
		{
			menuBackground = new Konva.Rect(
			{
				x: x,
				y: y,
				stroke: strokeColorMenu,
				strokeWidth: 1,
				fill: color,
				width: width,
				height: height,
				opacity: 0.9,
				cornerRadius: 4,
				listening:listening,
				perfectDrawEnabled : false,
				transformsEnabled : 'position'
			});
		}
		
		groupDrag.add(menuBackground);
		menuBackground.moveToBottom();
		return menuBackground;
	}
	
	this.addFieldCard = function(x, y, width, height, text, color, callback, imgSrc)
	{
		callback = typeof callback !== 'undefined' ? callback : undefined;
		color = typeof color !== 'undefined' ? color : "";
		imgSrc = typeof imgSrc !== 'undefined' ? imgSrc : "";
		
		var group= new Konva.Group(
		{
			x: x,
			y: y,
			width:width,
			height:height,
			transformsEnabled : 'position'
		});

		var rectHeight=height/5;
		
		if(color=="")
		{
			rectHeight=0;
		}
		
		var rect = new Konva.Rect(
		{
			x: 0,
			y: 0,
			stroke: "black",
			strokeWidth: 1,
			fill: color,
			width: width,
			height: rectHeight,
			listening:false,
			perfectDrawEnabled : false,
			transformsEnabled : 'position'
		});
		
		var textObj = new Konva.Text(
		{
			x: 2,
			y: rectHeight+2,
			text: text,
			fontSize: 16,
			fontFamily: 'Calibri',
			fill: textColor,
			width: width-4,
			padding: 4,
			align: 'center',
			strokeWidth: 1,
			perfectDrawEnabled : false,
			listening:false,
			transformsEnabled : 'position'
		});
		
		group.add(rect);
		var rect2; 
		
		if(imgSrc!="")
		{
			var imageObj = new Image();
			imageObj.src = imgSrc;
		
			rect2 = new Konva.Image(
			{
				image: imageObj,
				x: 0,
				y: rectHeight,
				width: width,
				height: Math.max(textObj.getHeight(),height-rectHeight),
				stroke: 'black',
				strokeWidth: 2,
				perfectDrawEnabled : false,
				listening:false,
				transformsEnabled : 'position'
			});
			
			var rectText = new Konva.Rect(
			{
				x: 2,
				y: rectHeight+2,
				stroke: '#999',
				strokeWidth: 1,
				fill: '#262626',
				width: width-4,
				height: textObj.getHeight(),
				opacity:0.8,
				cornerRadius: 10,
				listening:false,
				perfectDrawEnabled : false,
				transformsEnabled : 'position'
			});
			
			group.add(rect2);
			group.add(rectText);
		}
		else
		{	
			rect2 = new Konva.Rect(
			{
				x: 0,
				y: rectHeight,
				stroke: "black",
				strokeWidth: 1,
				fill: buttonColor,
				width: width,
				height: Math.max(textObj.getHeight(),height-rectHeight),
				perfectDrawEnabled : false,
				listening:false,
				transformsEnabled : 'position'
			});
			group.add(rect2);
		}
		
		group.add(textObj);
		
		
		var chargeObj = new Konva.Text(
		{
			x: 20,
			y: 0,
			text: GLOBAL_MORTGAGE_FIELD_TEXT,
			fontSize: 26,
			fontFamily: 'Calibri',
			fontStyle: "bold",
			fill: "#cc0000",
			width:Math.sqrt(width*width+height*height),
			padding: 4,
			rotation: 65,
			align: 'center',
			strokeWidth: 1,
			perfectDrawEnabled : false,
			listening:false,
			shadowColor: 'black',
			shadowBlur: 4,
			shadowOffset: [10, 10],
			id: 'chargeObj'
		});
		chargeObj.hide();
		group.add(chargeObj);
		
		var colisionRect = new Konva.Image(
		{
			x: 0,
			y: 0,
			width: width,
			height: height,
			transformsEnabled : 'position'
		});
		
		group.add(colisionRect);
		
		var originalX=x;
		var originalY=y;

		var changePointerEnter=function()
		{
			document.body.style.cursor = 'help';
			group.moveToTop();
			group.y(originalY-16);
			layer.draw();
		};
		
		var changePointerOut=function()
		{
			document.body.style.cursor = 'default';
			group.y(originalY);
			layer.draw();
		};
		
		group.on("mouseout", changePointerOut);
		group.on("mouseenter", changePointerEnter);

		var upAction=function()
		{
			if(callback!=undefined && callback!="")
			{
				queueManager.add(callback);
			}
		};
		
		group.on("click", upAction);
		groupDrag.add(group);
		group.cache();
		return [group,chargeObj];
	}
	
	this.addButton = function(x, y, width, height, text, callback, tooltipText, imgSrc)
	{
		callback = typeof callback !== 'undefined' ? callback : undefined;
		tooltipText = typeof tooltipText !== 'undefined' ? tooltipText : "";
		imgSrc = typeof imgSrc !== 'undefined' ? imgSrc : "";
		
		var innerObj;
		var rect = new Konva.Rect(
		{
			x: x,
			y: y,
			stroke: strokeColor,
			strokeWidth: 2,
			fill: buttonColor,
			width: width,
			height: height,
			cornerRadius: 4,
			perfectDrawEnabled : false,
			transformsEnabled : 'position'
		});
		groupDrag.add(rect);
		
		if(imgSrc=="")
		{
			innerObj = new Konva.Text(
			{
				x: x,
				y: y,
				text: text,
				fontSize: 18,
				fontFamily: 'Calibri',
				fill: textColor,
				width: width,
				padding: 4,
				align: 'center',
				listening : false,
				perfectDrawEnabled : false,
				transformsEnabled : 'position'
			});
		}
		else
		{
			var imageObj = new Image();
			imageObj.src = imgSrc;
			
			innerObj = new Konva.Image(
			{
				image: imageObj,
				x: x,
				y: y,
				padding: 4,
				align: 'center',
				width: width,
				height: height,
				listening : false,
				perfectDrawEnabled : false,
				transformsEnabled : 'position'
			});
		}
		
		if(tooltipText!="")
		{
			var tooltip = new Konva.Label(
			{
				opacity: 0.9
			});
			
			var tag=new Konva.Tag(
			{
				fill: '#262626',
				pointerDirection: 'down',
				pointerWidth: 10,
				pointerHeight: 20,
				lineJoin: 'round',
				listening : false,
				perfectDrawEnabled : false,
				transformsEnabled : 'position'
			});
			tooltip.add(tag);
			
			tooltip.add(new Konva.Text(
			{
				text: tooltipText,
				fontFamily: 'Calibri',
				fontSize: 16,
				padding: 5,
				fill: '#DDD',
				listening : false,
				perfectDrawEnabled : false,
				transformsEnabled : 'position'
			}));
			tooltip.hide();
			tooltipLayer.add(tooltip);
			
			var tooltipFuncHover=function()
			{
				var mousePos = stage.getPointerPosition();
				
				tag.pointerDirection("down");
				if(mousePos.y<tag.getHeight()*2)
				{
					tag.pointerDirection("up");
					mousePos.y+=tag.getHeight()+40;
				}
				
				tooltip.position(
				{
					x : mousePos.x,
					y : mousePos.y
				});
				tooltip.show();
				tooltipLayer.batchDraw();
			};
			var tooltipFuncOut=function()
			{
				document.body.style.cursor = 'default';
				tooltip.hide();
				tooltipLayer.draw();
				rect.fill("#999");
				rect.draw();
				innerObj.draw();
			};
			
			var changeColor=function()
			{
				rect.fill(hoverColor);
				document.body.style.cursor = 'pointer';
				rect.draw();
				innerObj.draw();
			};
			
			rect.on("mousemove", tooltipFuncHover);
			rect.on("mouseout", tooltipFuncOut);
			rect.on("mouseenter", changeColor);
			
			var downAction=function(evt)
			{
				rect.fill(clickColor);
				rect.draw();
				innerObj.draw();
				evt.cancelBubble = true;
			};
			
			rect.on("mousedown", downAction);
			
			var upAction=function(evt)
			{
				rect.fill(buttonColor);
				rect.draw();
				innerObj.draw();
				evt.cancelBubble = true;
				if(callback!=undefined && callback!="")
				{
					queueManager.add(callback);
				}
			};
			
			rect.on("click", upAction);
		}
		else
		{
			var tooltipFuncOut=function()
			{
				document.body.style.cursor = 'default';
				rect.fill(buttonColor);
				rect.draw();
				innerObj.draw();
			};
			
			var changeColor=function()
			{
				rect.fill(hoverColor);
				document.body.style.cursor = 'pointer';
				rect.draw();
				innerObj.draw();
			};
			
			rect.on("mouseout", tooltipFuncOut);
			rect.on("mouseenter", changeColor);
			
			var downAction=function(evt)
			{
				rect.fill(clickColor);
				rect.draw();
				innerObj.draw();
				evt.cancelBubble = true;
			};
			
			rect.on("mousedown", downAction);
			
			var upAction=function(evt)
			{
				rect.fill(buttonColor);
				rect.draw();
				innerObj.draw();
				evt.cancelBubble = true;
				if(callback!=undefined && callback!="")
				{
					queueManager.add(callback);
				}
			};
			
			rect.on("click", upAction);
		}
		
		groupDrag.add(innerObj);
		return [rect,innerObj];
	}
	
	this.addText = function(x, y, width, text, listening)
	{
		listening = typeof listening !== 'undefined' ? listening : false;
		var textObj = new Konva.Text(
		{
			x: x,
			y: y,
			text: text,
			fontSize: 18,
			fontFamily: 'Calibri',
			fill: textColor,
			width: width,
			padding: 4,
			shadowColor: 'black',
			shadowBlur: 4,
			shadowOffset: [10, 10],
			shadowOpacity: 0.9,
			align: 'center',
			listening : listening,
			perfectDrawEnabled : false,
				transformsEnabled : 'position'
		});

		groupDrag.add(textObj);
		return textObj;
	}

	this.addTextInRect = function(x, y, width, text, colorRect, colorText,listening, roundCorner)
	{
		colorRect = typeof colorRect !== 'undefined' ? colorRect : buttonColor;
		colorText = typeof colorText !== 'undefined' ? colorText : textColor;
		listening = typeof listening !== 'undefined' ? listening : false;
		roundCorner = typeof roundCorner !== 'undefined' ? roundCorner : false;
		
		var cornerRadius=0;
		if(roundCorner)
		{
			cornerRadius=4;
		}
		
		var textObj = new Konva.Text(
		{
			x: x,
			y: y,
			text: text,
			fontSize: 16,
			fontFamily: 'Calibri',
			fill: textColor,
			width: width,
			padding: 4,
			align: 'center',
			listening : listening,
			perfectDrawEnabled : false,
				transformsEnabled : 'position'
		});

		
		var rect = new Konva.Rect(
		{
			x: x,
			y: y,
			stroke: strokeColor,
			strokeWidth: 2,
			fill: colorRect,
			width: width,
			height: textObj.getHeight(),
			cornerRadius: cornerRadius,
			perfectDrawEnabled : false,
			listening: listening,
				transformsEnabled : 'position'
		});
		

		groupDrag.add(rect);
		groupDrag.add(textObj);
		return [textObj,rect];
	}

	this.addRect = function(x, y, width, height, colorRect, listening, roundCorner)
	{
		colorRect = typeof colorRect !== 'undefined' ? colorRect : buttonColor;
		listening = typeof listening !== 'undefined' ? listening : false;
		roundCorner = typeof roundCorner !== 'undefined' ? roundCorner : false;
		
		var cornerRadius=0;
		if(roundCorner)
		{
			cornerRadius=4;
		}
		
		var rect = new Konva.Rect(
		{
			x: x,
			y: y,
			stroke: strokeColor,
			strokeWidth: 2,
			fill: colorRect,
			width: width,
			height: height,
			cornerRadius: cornerRadius,
			perfectDrawEnabled : false,
			listening: listening,
			transformsEnabled : 'position'
		});
		groupDrag.add(rect);

		return rect;
	}
}