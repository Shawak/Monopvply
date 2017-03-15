
function Map(konvaStage, fieldsPerSide)
{
	var width=konvaStage.getWidth();
	var height=konvaStage.getHeight();
	var stage=konvaStage;
	var layer;
	var sideFields=[];
	var fieldsPerSide=fieldsPerSide;
	
	var widthOneField=200;
	var heightOneField=270;
	
	var innerBackground;
	
	this.addSideField = function(field)
	{
		sideFields.push(field);
	}	
		
	this.setUp = function ()
	{
		layer = new Konva.Layer();
        stage.add(layer);
		
		loadBackground();
		return setSideFieldPositions();
	}
	
	function loadBackground()
	{
		var imageObj = new Image();
		imageObj.src = "./img/background.jpg";
		
		imageObj.onload = function() 
		{
			layer.draw();
		};
		
		innerBackground = new Konva.Image(
		{
            image: imageObj,
            x: heightOneField,
            y: heightOneField,
            width: widthOneField*fieldsPerSide,
            height: widthOneField*fieldsPerSide,
        });
		
		layer.add(innerBackground);
	}
	
	function setSideFieldPositions()
	{
		if(sideFields.length != fieldsPerSide*4)
		{
			return false;
		}
		
		var currIdx=0;
		for (var x = 0; x < fieldsPerSide; x++)
		{
			sideFields[currIdx].construct(layer, x*widthOneField+heightOneField, 0, widthOneField, heightOneField, "top");
			currIdx++;
		}
		
		for (var y = 0; y < fieldsPerSide; y++)
		{
			sideFields[currIdx].construct(layer, fieldsPerSide*widthOneField+heightOneField, y*widthOneField+heightOneField, widthOneField,heightOneField, "right");
			currIdx++;
		}
			
		for (var x = 0; x < fieldsPerSide; x++)
		{
			sideFields[currIdx].construct(layer, x*widthOneField+heightOneField, widthOneField*fieldsPerSide+heightOneField, widthOneField, heightOneField, "bottom");
			currIdx++;
		}
		
		for (var y = 0; y < fieldsPerSide; y++)
		{
			sideFields[currIdx].construct(layer, 0, y*widthOneField+heightOneField, widthOneField,heightOneField, "left");
			currIdx++;
		}
		
		layer.draw();
		
		return true;
	}
}