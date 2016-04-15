var gpio = require('rpi-gpio');

components.Pin = {
	init: function(initData, done, settings){
		console.log("Pin init: " + initData);

		if(initData){
			var inout = gpio.DIR_IN;
			
			if(initData.io == "output")
				inout = gpio.DIR_OUT;
			
			gpio.setup(initData.gpioPort, inout, function(){
				console.log("Pin " + initData.gpioPort + " opened");
				if(inout == gpio.DIR_IN){
					console.log(initData.gpioPort);
					gpio.read(initData.gpioPort, function(err, value) {
						if (err) throw err;
						
						if(initData.time){
							var max_sec = new Date().getTime();
							while (new Date() < max_sec + initData.time) {}
						}
						
						done(settings.end);
				    });
				} else {
					console.log(initData.gpioPort);
					gpio.write(initData.gpioPort, initData.value, function(err) {
				        if (err) throw err;
				        
				        if(initData.time){
							var max_sec = new Date().getTime();
							while (new Date() < max_sec + initData.time) {}
						}
						
						done(settings.end);
				    });
				}
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