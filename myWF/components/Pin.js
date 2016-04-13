var gpio = require("pi-gpio");

components.Pin = {
	init: function(initData, done){
		console.log("Pin init: " + initData);

		if(initData){
			gpio.open(initData.gpioPort, initData.io, function(err) { 
				console.log("Pin " + initData.gpioPort + " opened");
				gpio.write(initData.gpioPort, initData.value, function() {
					console.log("Pin " + initData.gpioPort + " written");
					gpio.close(initData.gpioPort);
					
					done();
				});
			});
		}

		return {
			inPort: function(){
				
			},
			outPort: function(){
				
			}
		}; 
	}	
};