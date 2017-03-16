
function Map(konvaStage)
{
	var width=konvaStage.getWidth();
	var height=konvaStage.getHeight();
	var stage=konvaStage;
	var layer;
	var sideFields=[];
	var cornerFields=[];
	var fieldsPerSide;
	
	var widthOneSideField=200;
	var heightOneSideField=270;
	
	var innerBackground;
	
	this.addSideField = function(field)
	{
		sideFields.push(field);
	}

	this.addCornerField = function(field)
	{
		cornerFields.push(field);
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
		
		layer = new Konva.Layer();
        stage.add(layer);
		
		loadBackground();
		setSideFieldPositions();
		setCornerFieldPositions();
		return true;
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
			
		for (var x = 0; x < fieldsPerSide; x++)
		{
			sideFields[currIdx].construct(layer, x*widthOneSideField+heightOneSideField, widthOneSideField*fieldsPerSide+heightOneSideField, widthOneSideField, heightOneSideField, "bottom");
			currIdx++;
		}
		
		for (var y = 0; y < fieldsPerSide; y++)
		{
			sideFields[currIdx].construct(layer, 0, y*widthOneSideField+heightOneSideField, widthOneSideField,heightOneSideField, "left");
			currIdx++;
		}
		
		layer.draw();
		
	}
}