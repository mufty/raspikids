components.Sleep = {
	init: function(initData, done){
		console.log("Sleep: " + initData);

		if(initData){
			var max_sec = new Date().getTime();
			while (new Date() < max_sec + initData.time) {}
			done();
		}

		return {
			inPort: function(){
				
			},
			outPort: function(){
				
			}
		}; 
	}	
};