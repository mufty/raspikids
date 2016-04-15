var gpio = require('rpi-gpio');

components.Pin = {
	init: function(initData, done){
		console.log("Pin init: " + initData);

		if(initData){
			var inout = gpio.DIR_IN;
			if(initData.io){
				if(initData.io == "output")
					inout = gpio.DIR_IN;
				
				gpio.setup(initData.gpioPort, inout, function(){
					console.log("Pin " + initData.gpioPort + " opened");
					if(inout == gpio.DIR_IN){
						gpio.read(initData.gpioPort, function(err, value) {
							if (err) throw err;
							
							if(initData.time){
								var max_sec = new Date().getTime();
								while (new Date() < max_sec + initData.time) {}
							}
							
							done();
					    });
					} else {
						gpio.write(7, true, function(err) {
					        if (err) throw err;
					        
					        if(initData.time){
								var max_sec = new Date().getTime();
								while (new Date() < max_sec + initData.time) {}
							}
							
							done();
					    });
					}
				});
			}
		}

		return {
			inPort: function(){
				
			},
			outPort: function(){
				
			}
		}; 
	}	
};