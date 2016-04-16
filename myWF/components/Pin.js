var gpio = require('rpi-gpio');

components.Pin = {
	init: function(initData, done, settings){
		console.log("Pin init: " + initData);
		
		var clean = false;
		
		//wait for clean up
		gpio.destroy(function() {
	        console.log('All pins unexported');
	        if(initData){
				var inout = gpio.DIR_IN;
				
				var edge = gpio.EDGE_BOTH;
				
				if(initData.io == "output"){
					inout = gpio.DIR_OUT;
					edge = gpio.EDGE_NONE;
				}
				
				gpio.setup(initData.gpioPort, inout, edge, function(){
					console.log("Pin " + initData.gpioPort + " opened");
					if(inout == gpio.DIR_IN){
						
						var out = initData.out;
						
						for(var i in out){
							if(out[i].onChange){
								var executed = false;
								gpio.on('change', function(channel, value) {
									if(!executed){
										executed = true;
										console.log('Channel ' + channel + ' value is now ' + value);
										if(channel == initData.gpioPort)
											gpio.destroy(function() {done(settings.end, out[i].target)});
									}
								});
							} else {
								gpio.read(initData.gpioPort, function(err, value) {
									if (err) throw err;
									
									if(initData.time){
										var max_sec = new Date().getTime();
										while (new Date() < max_sec + initData.time) {}
									}
									
									done(settings.end, out[i].target);
							    });
							}
						}
					} else {
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
	    });

		return {
			inPort: function(){
				
			},
			outPort: function(){
				
			}
		}; 
	}	
};