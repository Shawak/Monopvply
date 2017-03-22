function QueueManager()
{
	var callbackQueue=[];
	var that=this;
	var stop=false;
	
	this.clear = function()
	{
		callbackQueue=[];
	}
	
	this.start = function()
	{
		stop=false;
		that.callNext();
	}

	this.stop = function()
	{
		stop=true;
	}
	
	this.callNext = function(loop)
	{
		loop = typeof loop !== 'undefined' ? loop : true;
		
		if(callbackQueue.length>0)
		{
			var currCallback=callbackQueue[0];
			callbackQueue.shift();
			if(currCallback()===false)
			{
				callbackQueue.push(currCallback);
			}
		}
		if(loop && !stop)
		{
			setTimeout(function(){ that.callNext() }, 200);
		}
	}
	
	this.add = function(callback)
	{
		callbackQueue.push(callback);
		that.callNext(false);
	}
}