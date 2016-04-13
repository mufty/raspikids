var gpio = require("pi-gpio");

components.Pin = {
	init: function(initData){
		console.log("Pin init: " + initData);

		if(initData){
			gpio.open(initData.gpioPort, initData.io, function(err) { 
				console.log("Pin " + initData.gpioPort + " opened");
				gpio.write(initData.gpioPort, initData.value, function() {
					console.log("Pin " + initData.gpioPort + " written");
					gpio.close(initData.gpioPort);
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