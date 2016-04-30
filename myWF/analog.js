var gpio = require('rpi-gpio');

var pinNum = 12;

var measurement = 0;

var out = function(){
	gpio.setup(pinNum, gpio.DIR_OUT, function(){
		measurement = 0;
		gpio.write(pinNum, false, function(err) {
	        if (err) throw err;
	        
	        gpio.destroy(function() {
	        	input();
	        });
	        
	    });
	});
};

var input = function(){
	gpio.setup(pinNum, gpio.DIR_IN, function(){
		gpio.read(pinNum, function(err, value) {
	        if (err) throw err;
	        
	        gpio.destroy(function() {
	        	if(!value){
	        		measurement += 1;
	        		input();
	        	} else {
	        		out();
	        		console.log(measurement);
	        	}
	        });
	        
	    });
	});
};

out();

setTimeout(function(){
	
}, 100000);