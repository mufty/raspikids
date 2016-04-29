require('./BaseComponent.js');
var gpio = require('rpi-gpio');

components.Pin = class Pin extends BaseComponent {
	constructor(initData, done, settings){
		super(initData, done, settings);
		console.log("Pin init: " + initData);
		this.clean = false;
		
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
					console.log("Pin " + this.initData.gpioPort + " opened");
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
											gpio.destroy(function() {
												this.next(out[i].target)
											}.bind(this));
									}
								}.bind(this));
							} else {
								gpio.read(this.initData.gpioPort, function(err, value) {
									if (err) throw err;
									
									if(this.initData.time){
										var max_sec = new Date().getTime();
										while (new Date() < max_sec + this.initData.time) {}
									}
									
									this.next(out[i].target);
							    }.bind(this));
							}
						}
					} else {
						gpio.write(this.initData.gpioPort, this.initData.value, function(err) {
					        if (err) throw err;
					        
					        if(this.initData.time){
								var max_sec = new Date().getTime();
								while (new Date() < max_sec + this.initData.time) {}
							}
							
							this.next(this.settings.end);
					    }.bind(this));
					}
				}.bind(this));
			}
	    }.bind(this));
	}
};