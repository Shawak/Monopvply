
function Map(konvaStage)
{
	var width=konvaStage.getWidth();
	var height=konvaStage.getHeight();
	var stage=konvaStage;
	var layer;
	var sideFields=[];
	var cornerFields=[];
	var fieldsPerSide;
	
	var widthOneSideField=160;
	var heightOneSideField=210;
	
	if(isMobileDevice())
	{
		widthOneSideField=100;
		heightOneSideField=130;
	}
	
	var innerBackground;
	
	this.addSideField = function(field)
	{
		sideFields.push(field);
	}

	this.addCornerField = function(field)
	{
		cornerFields.push(field);
	}	
	
	this.hideAll = function (hide)
	{
		if(hide==false)
		{
			layer.show();
			layer.draw();
		}
		else
		{
			layer.hide();
		}
	}
	
	this.setUp = function ()
	{
		if(sideFields.length%4!=0)
		{
			return false;
		}
		
		fieldsPerSide=sideFields.length/4;
		
		if(cornerFields.length != 4)
		{
			return false;
		}
		
		layer = new Konva.Layer(
		{
            draggable: true
        });
		
		stage.add(layer);
		
        window.addEventListener('wheel', function(e)
		{
			var scaleBy = 0.9;
            e.preventDefault();
            var oldScale = layer.scaleX();
            var mousePointTo = 
			{
                x: stage.getPointerPosition().x / oldScale - layer.x() / oldScale,
                y: stage.getPointerPosition().y / oldScale - layer.y() / oldScale,
            };
            var newScale = e.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
            layer.scale({ x: newScale, y: newScale });
            var newPos = 
			{
                x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
                y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
            };
            layer.position(newPos);
            layer.batchDraw();
        });
		
		setSideFieldPositions();
		setCornerFieldPositions();
		loadBackground();
		layer.moveToBottom();
		return true;
	}
	
	function loadBackground()
	{
		var imageObj = new Image();
		imageObj.src = "./img/background.jpg";
		
		imageObj.onload = function() 
		{
			setTimeout(function()
			{ 
				var container = document.querySelector('#stage-parent');
				var containerWidth = container.offsetWidth;
				var containerHeight = container.offsetHeight;
				
				stage.height(Math.max(fieldsPerSide*widthOneSideField+heightOneSideField*2,stage.height()));
				stage.width(Math.max(fieldsPerSide*widthOneSideField+heightOneSideField*2,stage.width()));
				stage.show(true);
				layer.draw();
				layer.cache();

				var scaleX = containerWidth / stage.getWidth();
				var scaleY = containerHeight / stage.getHeight();
				var scale = (scaleX < scaleY ? scaleX : scaleY)-0.05 ;
				layer.scale({ x: scale, y: scale});
				
				var newPos = 
				{
					x: (containerWidth-stage.width()*scale)/2,
					y: (containerHeight-stage.height()*scale)/2
				};
				layer.position(newPos);
				
				layer.draw();
				
				document.getElementById("overlayDiv").style.display="none";
			}, 500);  
		};
		
		innerBackground = new Konva.Image(
		{
            image: imageObj,
            x: heightOneSideField,
            y: heightOneSideField,
            width: widthOneSideField*fieldsPerSide,
            height: widthOneSideField*fieldsPerSide,
        });
		
		layer.add(innerBackground);
	}
	
	function setCornerFieldPositions()
	{
		cornerFields[0].construct(layer, 0, 0, heightOneSideField, heightOneSideField, "top",true);
		cornerFields[1].construct(layer, widthOneSideField*fieldsPerSide+heightOneSideField, 0, heightOneSideField, heightOneSideField, "right",true);
		cornerFields[2].construct(layer, widthOneSideField*fieldsPerSide+heightOneSideField, widthOneSideField*fieldsPerSide+heightOneSideField, heightOneSideField, heightOneSideField, "bottom",true);
		cornerFields[3].construct(layer, 0, widthOneSideField*fieldsPerSide+heightOneSideField, heightOneSideField, heightOneSideField, "left",true);
	}
	
	function setSideFieldPositions()
	{
		var currIdx=0;
		for (var x = 0; x < fieldsPerSide; x++)
		{
			sideFields[currIdx].construct(layer, x*widthOneSideField+heightOneSideField, 0, widthOneSideField, heightOneSideField, "top");
			currIdx++;
		}
		
		for (var y = 0; y < fieldsPerSide; y++)
		{
			sideFields[currIdx].construct(layer, fieldsPerSide*widthOneSideField+heightOneSideField, y*widthOneSideField+heightOneSideField, widthOneSideField,heightOneSideField, "right");
			currIdx++;
		}
			
		for (var x = fieldsPerSide-1; x >=0 ; x--)
		{
			sideFields[currIdx].construct(layer, x*widthOneSideField+heightOneSideField, widthOneSideField*fieldsPerSide+heightOneSideField, widthOneSideField, heightOneSideField, "bottom");
			currIdx++;
		}
		
		for (var y = fieldsPerSide-1; y >=0 ; y--)
		{
			sideFields[currIdx].construct(layer, 0, y*widthOneSideField+heightOneSideField, widthOneSideField,heightOneSideField, "left");
			currIdx++;
		}
		
		layer.draw();
		
	}
}