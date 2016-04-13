components.Sleep = {
	init: function(initData){
		console.log("Sleep: " + initData);

		if(initData){
			var max_sec = new Date().getTime();
			while (new Date() < max_sec + initData.time) {}
			    return true;
		}

		return {
			inPort: function(){
				
			},
			outPort: function(){
				
			}
		}; 
	}	
};