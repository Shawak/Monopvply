
function Menu(konvaStage,fillColorMenu,strokeColorMenu,buttonColor,strokeColor,textColor,hoverColor,clickColor)
{
	var stage=konvaStage;
	var layer;
	var tooltipLayer;
	var buttons=[];
	var buttonColor=typeof buttonColor !== 'undefined' ? buttonColor : '#999';
	var strokeColor=typeof strokeColor !== 'undefined' ? strokeColor : '#262626';
	var textColor=typeof textColor !== 'undefined' ? textColor : '#FFF';
	var hoverColor=typeof hoverColor !== 'undefined' ? hoverColor : "#888";
	var clickColor=typeof clickColor !== 'undefined' ? clickColor : "#555";
	var fillColorMenu=typeof fillColorMenu !== 'undefined' ? fillColorMenu : "#CCC";
	var strokeColorMenu=typeof strokeColorMenu !== 'undefined' ? strokeColorMenu : strokeColor;
	
	init();
	
	function init()
	{
		layer = new Konva.Layer();
		tooltipLayer = new Konva.Layer();
        stage.add(layer);
		stage.add(tooltipLayer);
		layer.moveToTop();
		tooltipLayer.moveToTop();
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
	
	this.addMenuBackground = function(x, y, width, height, imgSrc)
	{
		imgSrc = typeof imgSrc !== 'undefined' ? imgSrc : "";
		
		var menuBackground;
		
		if(imgSrc!="")
		{
			var imageObj = new Image();
			imageObj.src = imgSrc;
			
			imageObj.onload = function() 
			{
				layer.draw();
			};
			
			menuBackground = new Konva.Image(
			{
				image: imageObj,
				x: x,
				y: y,
				align: 'center',
				width: width,
				height: height,
				listening : false,
				shadowColor: 'black',
				shadowBlur: 10,
				shadowOffset: [10, 10],
				shadowOpacity: 0.2,
				opacity: 0.5,
				cornerRadius: 4,
				stroke: strokeColorMenu,
				strokeWidth: 1,
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
				fill: fillColorMenu,
				width: width,
				height: height,
				shadowColor: 'black',
				shadowBlur: 10,
				shadowOffset: [10, 10],
				shadowOpacity: 0.2,
				opacity: 0.5,
				cornerRadius: 4,
				listening:false
			});
		}
		
		layer.add(menuBackground);
		menuBackground.moveToBottom();
	}
	
	this.addFieldCard = function(x, y, width, height, text, color, callback)
	{
		callback = typeof callback !== 'undefined' ? callback : undefined;
		color = typeof color !== 'undefined' ? color : "gray";
		
		var rectHeight=height/5;
		
		var rect = new Konva.Rect(
		{
			x: x,
			y: y,
			stroke: "black",
			strokeWidth: 1,
			fill: color,
			width: width,
			opacity: 0.9,
			height: rectHeight
		});
		
		var textObj = new Konva.Text(
		{
			x: x,
			y: y+rectHeight,
			text: text,
			fontSize: 16,
			fontFamily: 'Calibri',
			fill: textColor,
			width: width,
			padding: 4,
			align: 'center',
			strokeWidth: 1,
			opacity: 0.9,
			listening:false
		});
		
		var rect2 = new Konva.Rect(
		{
			x: x,
			y: y+rectHeight,
			stroke: "black",
			strokeWidth: 1,
			fill: buttonColor,
			width: width,
			opacity: 0.9,
			height: Math.max(textObj.getHeight(),height-rectHeight)
		});
		
		layer.add(rect);
		layer.add(rect2);
		layer.add(textObj);
		
		var changePointerEnter=function()
		{
			document.body.style.cursor = 'help';
			rect.moveToTop();
			rect2.moveToTop();
			textObj.moveToTop();
			layer.draw();
		};
		
		var changePointerOut=function()
		{
			document.body.style.cursor = 'default';
		};
		
		rect.on("mouseout", changePointerOut);
		rect2.on("mouseout", changePointerOut);
		rect.on("mouseenter", changePointerEnter);
		rect2.on("mouseenter", changePointerEnter);
		
		var upAction=function()
		{
			if(callback!=undefined && callback!="")
			{
				callback();
			}
		};
		
		rect.on("mouseup", upAction);
		rect2.on("mouseup", upAction);
	}
	
	this.addButton = function(x, y, width, height, text,  callback, tooltipText,imgSrc)
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
			shadowColor: 'black',
			shadowBlur: 10,
			shadowOffset: [10, 10],
			shadowOpacity: 0.2,
			opacity: 0.9,
			cornerRadius: 4,
		});
		layer.add(rect);
		
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
				listening : false
			});
		}
		else
		{
			var imageObj = new Image();
			imageObj.src = imgSrc;
			
			imageObj.onload = function() 
			{
				layer.draw();
			};
			
			innerObj = new Konva.Image(
			{
				image: imageObj,
				x: x,
				y: y,
				padding: 4,
				align: 'center',
				width: width,
				height: height,
				listening : false
			});
		}
		
		if(tooltipText!="")
		{
			var tooltip = new Konva.Label(
			{
				opacity: 0.75
			});
			
			tooltip.add(new Konva.Tag(
			{
				fill: '#262626',
				pointerDirection: 'down',
				pointerWidth: 10,
				pointerHeight: 10,
				lineJoin: 'round',
				shadowColor: 'black',
				shadowBlur: 10,
				shadowOffset: 10,
				shadowOpacity: 0.5,
				listening : false
			}));
			
			tooltip.add(new Konva.Text(
			{
				text: tooltipText,
				fontFamily: 'Calibri',
				fontSize: 16,
				padding: 5,
				fill: '#DDD',
				listening : false
			}));
			
			tooltipLayer.add(tooltip);
			
			var tooltipFuncHover=function()
			{
				var mousePos = stage.getPointerPosition();
				
				tooltip.position(
				{
					x : mousePos.x,
					y : mousePos.y - 5
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
				layer.batchDraw();
			};
			
			var changeColor=function()
			{
				rect.fill(hoverColor);
				document.body.style.cursor = 'pointer';
				layer.batchDraw();
			};
			
			rect.on("mousemove", tooltipFuncHover);
			rect.on("mouseout", tooltipFuncOut);
			rect.on("mouseenter", changeColor);
			
			var downAction=function()
			{
				rect.fill(clickColor);
				layer.batchDraw();
			};
			
			rect.on("mousedown", downAction);
			
			var upAction=function()
			{
				rect.fill(buttonColor);
				layer.batchDraw();
				if(callback!=undefined && callback!="")
				{
					callback();
				}
			};
			
			rect.on("mouseup", upAction);
		}
		
		layer.add(innerObj);
		buttons.push([rect,innerObj]);
	}
	
	this.addText = function(x, y, width, text)
	{
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
			align: 'center',
			listening : false
		});

		layer.add(textObj);
	}
}