require('./BaseComponent.js');
var gpio = require('rpi-gpio');

components.Pin = class Pin extends BaseComponent {
	constructor(initData, done, settings){
		super(initData, done, settings);
		console.log("Pin init: " + initData);
		this.clean = false;
	}
	startUp(){
		myEmitter.once('unexported' + this.initData.gpioPort, function() {
			this.init();
		}.bind(this));
		
		this.unexport();
	}
	
	init(){
		this.setup(function(){
			console.log("Pin " + this.initData.gpioPort + " opened");
			if(this.inout == gpio.DIR_IN){
				
				var out = this.initData.out;
				
				for(var i in out){
					if(out[i].onChange){
						var executed = false;
						gpio.on('change', function(channel, value) {
							if(!executed){
								executed = true;
								console.log('Channel ' + channel + ' value is now ' + value);
								if(channel == this.initData.gpioPort){
									myEmitter.once('unexported' + this.initData.gpioPort, function() {
										this.next(out[i].target);
									}.bind(this));
									
									this.unexport();
								}
							}
						}.bind(this));
					} else {
						gpio.read(this.initData.gpioPort, function(err, value) {
							if (err) throw err;
							
							if(this.initData.input && this.initData.input.time){
								console.log(this.initData.input.time);
								var max_sec = new Date().getTime();
								while (new Date() < max_sec + this.initData.input.time) {}
							}
							
							this.next(out[i].target);
					    }.bind(this));
					}
				}
			} else {
				gpio.write(this.initData.gpioPort, this.initData.value, function(err) {
			        if (err) throw err;
			        
			        this.handleTimeout();
			        
			        myEmitter.once('unexported' + this.initData.gpioPort, function() {
			        	this.handleOutputs();
					}.bind(this));
			        
			        this.unexport();
			    }.bind(this));
			}
		}.bind(this));
	}
	
	setup(cb){
		if(this.initData){
			this.inout = gpio.DIR_IN;
			
			var edge = gpio.EDGE_BOTH;
			
			if(this.initData.io == "output"){
				this.inout = gpio.DIR_OUT;
				edge = gpio.EDGE_NONE;
			}
			
			gpio.setup(this.initData.gpioPort, this.inout, edge, cb);
		}
	}
};