require('./Pin.js');
var gpio = require('rpi-gpio');

components.TimedInputPin = class TimedInputPin extends components.Pin {
	constructor(initData, done, settings){
		super(initData, done, settings);
		this.measurement = 0;
	}
	startUp(){
		myEmitter.once('unexported' + this.initData.gpioPort, function() {
			this._out();
		}.bind(this));
		
		this.unexport();
	}
	_out(){
		if(this.initData){
			gpio.setup(this.initData.gpioPort, gpio.DIR_OUT, function(){
	    		this.measurement = 0;
	    		gpio.write(this.initData.gpioPort, false, function(err) {
	    	        if (err) throw err;
	    	        
	    	        //this.unexport();
	    	        this._input();
	    	        
	    	    }.bind(this));
	    	}.bind(this));
		}
	}
	_input(){
		if(this.initData){
			gpio.setup(this.initData.gpioPort, gpio.DIR_IN, function(){
				gpio.read(this.initData.gpioPort, function(err, value) {
			        if (err) throw err;
			        
			        if(!value){
		        		this.measurement += 1;
		        		this._input();
		        	} else {
		        		myEmitter.once('unexported' + this.initData.gpioPort, function() {
		        			this.handleOutputs();
		        		}.bind(this));
		        		
		        		this.unexport();
		        	}
			    }.bind(this));
			}.bind(this));
		}
	}
};