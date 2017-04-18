function QueueManager()
{
	var callbackQueue=[];
	var that=this;
	var stop=true;
	var busy=false;
	
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
		if(busy==true)
		{
			return;
		}
		busy=true;
		
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
			setTimeout(function(){ that.callNext() }, 100);
		}
		busy=false;
	}
	
	this.add = function(callback)
	{
		callbackQueue.push(callback);
	}
}