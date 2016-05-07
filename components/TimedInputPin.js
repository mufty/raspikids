require('./Pin.js');
var gpio = require('rpi-gpio');

components.TimedInputPin = class TimedInputPin extends components.Pin {
	constructor(initData, done, settings){
		super(initData, done, settings);
		this.measurement = 0;
	}
	startUp(){
		this.unexport(function(){
			this._out();
		}.bind(this));
	}
	_out(){
		if(this.initData){
			gpio.setup(this.initData.gpioPort, gpio.DIR_OUT, function(){
	    		this.measurement = 0;
	    		gpio.write(this.initData.gpioPort, false, function(err) {
	    	        if (err) throw err;
	    	        
	    	        this.unexport(function(){
	    	        	this._input();
	    	        }.bind(this));
	    	        
	    	    }.bind(this));
	    	}.bind(this));
		}
	}
	_input(){
		if(this.initData){
			gpio.setup(this.initData.gpioPort, gpio.DIR_IN, function(){
				gpio.read(this.initData.gpioPort, function(err, value) {
			        if (err) throw err;
			        
			        this.unexport(function(){
			        	if(!value){
			        		this.measurement += 1;
			        		this._input();
			        	} else {
					        this.handleOutputs();
			        	}
			        }.bind(this));
			    }.bind(this));
			}.bind(this));
		}
	}
};