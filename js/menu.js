
function Menu(konvaStage)
{
	var stage=konvaStage;
	var layer;
	var tooltipLayer;
	var buttons=[];
	
	init();
	
	function init()
	{
		layer = new Konva.Layer();
		tooltipLayer = new Konva.Layer();
        stage.add(layer);
		stage.add(tooltipLayer);
	}
	
	this.addButton = function(x, y, width, height, text,  callback=undefined, tooltipText="",imgSrc="")
	{
		var innerObj;
		var rect = new Konva.Rect(
		{
			x: x,
			y: y,
			stroke: '#262626',
			strokeWidth: 3,
			fill: '#999',
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
				fill: '#FFF',
				width: width,
				padding: 4,
				align: 'center',
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
				shadowOpacity: 0.5
			}));
			
			tooltip.add(new Konva.Text(
			{
				text: tooltipText,
				fontFamily: 'Calibri',
				fontSize: 16,
				padding: 5,
				fill: '#DDD'
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
				layer.draw();
			};
	
			var changeColor=function()
			{
				rect.fill("#888");
				document.body.style.cursor = 'pointer';
				layer.draw();
			};
	
			rect.on("mousemove", tooltipFuncHover);
			innerObj.on("mousemove", tooltipFuncHover);
			rect.on("mouseout", tooltipFuncOut);
			innerObj.on("mouseout", tooltipFuncOut);
			rect.on("mouseenter", changeColor);
			innerObj.on("mouseenter", changeColor);
			
			var downAction=function()
			{
				rect.fill("#555");
				layer.draw();
			};
			
			rect.on("mousedown", downAction);
			innerObj.on("mousedown", downAction);

			var upAction=function()
			{
				rect.fill("#888");
				layer.draw();
				if(callback!=undefined && callback!="")
				{
					callback();
				}
			};
			
			rect.on("mouseup", upAction);
			innerObj.on("mouseup", upAction);
		}
		
		layer.add(innerObj);
		buttons.push([rect,innerObj]);
		stage.draw();
	}
}