
function Map(konvaStage)
{
	var width=konvaStage.getWidth();
	var height=konvaStage.getHeight();
	var stage=konvaStage;
	var layer;
	var gameGroup;
	var mapGroup;
	var detailsGroup;
	var sideFields=[];
	var cornerFields=[];
	var fieldsPerSide;
	var containerWidth;
	var containerHeight;
	var innerBackground;
	var fieldPositions=[];
	
	var widthOneSideField=160;
	var heightOneSideField=210;
	
	if(isMobileDevice())
	{
		widthOneSideField=130;
		heightOneSideField=160;
	}
	
		
	this.getLastCreatedSideField =function()
	{
		return sideFields[sideFields.length-1];
	}
	
	
	this.getSideFieldsPerSide =function()
	{
		return fieldsPerSide;
	}
	
	this.getSideFields =function()
	{
		return sideFields;
	}

	this.getLayer =function()
	{
		return layer;
	}
	
	this.draw =function()
	{
		layer.draw();
	}

	this.getWidthField = function()
	{
		return widthOneSideField;
	}

	this.getHeightField = function()
	{
		return heightOneSideField;
	}

	this.getPositionOfField = function(field)
	{
		for(var i=0;i<fieldPositions.length;i++)
		{
			if(fieldPositions[i].getId() == field.getId())
			{
				return i;
			}
		}
		return -1;
	}
	
	this.getFieldsBetween = function(startFieldPosition, diceSum)
	{
		var fieldsBetween=[];
		if(startFieldPosition>-1)
		{
			if(diceSum<0)
			{
				diceSum+=fieldPositions.length;
			}
			console.log(startFieldPosition+" "+endPos);
			var endPos=(startFieldPosition+diceSum)%fieldPositions.length;
			
			if(startFieldPosition>endPos)
			{
				for(var i=startFieldPosition;i<fieldPositions.length;i++)
				{
					fieldsBetween.push(fieldPositions[i]);
				}
				startFieldPosition=0;
			}
			
			for(var i=startFieldPosition;i<fieldPositions.length && i<=endPos;i++)
			{
				fieldsBetween.push(fieldPositions[i]);
			}
		}
		return fieldsBetween;
	}
	
	this.getFieldById = function(id)
	{
		for(var i=0;i<sideFields.length;i++)
		{
			if(id==sideFields[i].getId())
			{
				return sideFields[i];
			}
		}	
		return undefined;
	}
	
	this.getFieldByText = function(name)
	{
		for(var i=0;i<sideFields.length;i++)
		{
			if(name==sideFields[i].getText())
			{
				return sideFields[i];
			}
		}	
		return undefined;
	}
	
	this.getDetailsGroup = function()
	{
		return detailsGroup;
	}
	
	this.addKonvaObj = function(konvaObj)
	{
		detailsGroup.add(konvaObj);
	}

	this.rotateRight = function()
	{
		var rotation=mapGroup.getRotation()%360;
		var newPos;
		var newRotation;
		if(rotation==0)
		{
			newPos = 
			{
				x: (mapGroup.x()+stage.width()*mapGroup.scaleX())|0,
				y: (mapGroup.y())|0
			};
			newRotation=90;
		}
		else if(rotation==90)
		{
			newPos = 
			{
				x: (mapGroup.x())|0,
				y: (mapGroup.y()+stage.height()*mapGroup.scaleY())|0
			};
			newRotation=180;
		}
		else if(rotation==180)
		{
			newPos = 
			{
				x: (mapGroup.x()-stage.width()*mapGroup.scaleX())|0,
				y: (mapGroup.y())|0
			};
			newRotation=270;
		}
		else if(rotation==270)
		{
			newPos = 
			{
				x: (mapGroup.x())|0,
				y: (mapGroup.y()-stage.height()*mapGroup.scaleY())|0
			};
			newRotation=0;
		}
		mapGroup.rotation(newRotation);
		detailsGroup.rotation(newRotation);
		mapGroup.position(newPos);
		detailsGroup.position(newPos);

		gameGroup.cache();
		layer.draw();
	}
	
	this.rotateLeft = function()
	{
		var rotation=mapGroup.getRotation()%360;
		var newPos;
		var newRotation;
		if(rotation==0)
		{
			newPos = 
			{
				x: (mapGroup.x())|0,
				y: (mapGroup.y()+stage.height()*mapGroup.scaleY())|0
			};
			newRotation=270;
		}
		else if(rotation==90)
		{
			newPos = 
			{
				x: (mapGroup.x()-stage.width()*mapGroup.scaleX())|0,
				y: (mapGroup.y())|0
			};
			newRotation=0;
		}
		else if(rotation==180)
		{
			newPos = 
			{
				x: (mapGroup.x())|0,
				y: (mapGroup.y()-stage.height()*mapGroup.scaleY())|0
			};
			newRotation=90;
		}
		else if(rotation==270)
		{
			newPos = 
			{
				x: (mapGroup.x()+stage.width()*mapGroup.scaleX())|0,
				y: (mapGroup.y())|0
			};
			newRotation=180;
		}
		mapGroup.rotation(newRotation);
		detailsGroup.rotation(newRotation);
		mapGroup.position(newPos);
		detailsGroup.position(newPos);

		gameGroup.cache();
		layer.draw();
	}
	
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
		
		mapGroup = new Konva.Group();
		gameGroup = new Konva.Group();
		
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
			
			if(newScale>=1.3 || newScale<=0.1)
			{
				return;
			}
			
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
		
		gameGroup.add(mapGroup);
		layer.add(gameGroup);
		
		detailsGroup = new Konva.Group(
		{
			offset: 
			{
				x: mapGroup.getWidth()/2,
				y: mapGroup.getHeight()/2
			}
		});
		
		layer.add(detailsGroup);
		stage.add(layer);
		layer.moveToBottom();
		
		detailsGroup.moveToTop();
		
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
				containerWidth = container.offsetWidth;
				containerHeight = container.offsetHeight;
				
				stage.height(Math.max(fieldsPerSide*widthOneSideField+heightOneSideField*2,stage.height()));
				stage.width(Math.max(fieldsPerSide*widthOneSideField+heightOneSideField*2,stage.width()));
				stage.show(true);
				gameGroup.cache();
				layer.draw();
				

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
		
		mapGroup.add(innerBackground);
	}
	
	function setCornerFieldPositions()
	{
		cornerFields[0].construct(layer,gameGroup,mapGroup, 0, 0, heightOneSideField, heightOneSideField, "top",true);
		cornerFields[1].construct(layer,gameGroup,mapGroup, widthOneSideField*fieldsPerSide+heightOneSideField, 0, heightOneSideField, heightOneSideField, "right",true);
		cornerFields[2].construct(layer,gameGroup,mapGroup, widthOneSideField*fieldsPerSide+heightOneSideField, widthOneSideField*fieldsPerSide+heightOneSideField, heightOneSideField, heightOneSideField, "bottom",true);
		cornerFields[3].construct(layer,gameGroup,mapGroup, 0, widthOneSideField*fieldsPerSide+heightOneSideField, heightOneSideField, heightOneSideField, "left",true);
	
		fieldPositions[0]=cornerFields[0];
		fieldPositions[fieldsPerSide+1]=cornerFields[1];
		fieldPositions[fieldsPerSide*2+2]=cornerFields[2];
		fieldPositions[fieldsPerSide*3+3]=cornerFields[3];
	}
	
	function setSideFieldPositions()
	{
		fieldPositions=[-1];
		var currIdx=0;
		for (var x = 0; x < fieldsPerSide; x++)
		{
			sideFields[currIdx].construct(layer,gameGroup,mapGroup, x*widthOneSideField+heightOneSideField, 0, widthOneSideField, heightOneSideField, "top");
			fieldPositions.push(sideFields[currIdx]);
			currIdx++;
		}
		
		fieldPositions.push(-1);
		
		for (var y = 0; y < fieldsPerSide; y++)
		{
			sideFields[currIdx].construct(layer,gameGroup,mapGroup, fieldsPerSide*widthOneSideField+heightOneSideField, y*widthOneSideField+heightOneSideField, widthOneSideField,heightOneSideField, "right");
			fieldPositions.push(sideFields[currIdx]);
			currIdx++;
		}
		
		fieldPositions.push(-1);
		
		for (var x = fieldsPerSide-1; x >=0 ; x--)
		{
			sideFields[currIdx].construct(layer,gameGroup,mapGroup, x*widthOneSideField+heightOneSideField, widthOneSideField*fieldsPerSide+heightOneSideField, widthOneSideField, heightOneSideField, "bottom");
			fieldPositions.push(sideFields[currIdx]);
			currIdx++;
		}
		
		fieldPositions.push(-1);
		
		for (var y = fieldsPerSide-1; y >=0 ; y--)
		{
			sideFields[currIdx].construct(layer,gameGroup,mapGroup, 0, y*widthOneSideField+heightOneSideField, widthOneSideField,heightOneSideField, "left");
			fieldPositions.push(sideFields[currIdx]);
			currIdx++;
		}
		
		layer.draw();
		
	}
}
