var gpio = require('rpi-gpio');

components.Pin = class Pin {
	constructor(initData, done, settings){
		console.log("Pin init: " + initData);
		this.clean = false;
		this.initData = initData;
		this.done = done;
		this.settings = settings;
		
		this._startUp();
	}
	_startUp(){
		gpio.destroy(function() {
	        console.log('All pins unexported');
	        if(this.initData){
				var inout = gpio.DIR_IN;
				
				var edge = gpio.EDGE_BOTH;
				
				if(this.initData.io == "output"){
					inout = gpio.DIR_OUT;
					edge = gpio.EDGE_NONE;
				}
				
				gpio.setup(this.initData.gpioPort, inout, edge, function(){
					console.log("Pin " + initData.gpioPort + " opened");
					if(inout == gpio.DIR_IN){
						
						var out = this.initData.out;
						
						for(var i in out){
							if(out[i].onChange){
								var executed = false;
								gpio.on('change', function(channel, value) {
									if(!executed){
										executed = true;
										console.log('Channel ' + channel + ' value is now ' + value);
										if(channel == this.initData.gpioPort)
											gpio.destroy(function() {this.done(this.settings.end, out[i].target)});
									}
								});
							} else {
								gpio.read(this.initData.gpioPort, function(err, value) {
									if (err) throw err;
									
									if(this.initData.time){
										var max_sec = new Date().getTime();
										while (new Date() < max_sec + this.initData.time) {}
									}
									
									this.done(this.settings.end, out[i].target);
							    });
							}
						}
					} else {
						gpio.write(this.initData.gpioPort, this.initData.value, function(err) {
					        if (err) throw err;
					        
					        if(this.initData.time){
								var max_sec = new Date().getTime();
								while (new Date() < max_sec + this.initData.time) {}
							}
							
							this.done(this.settings.end);
					    });
					}
				});
			}
	    });
	}
};