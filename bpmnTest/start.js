var bpmn = require("bpmn");

var logLevels = require('bpmn').logLevels;

bpmn.createUnmanagedProcess(__dirname + "/models/process_1.bpmn", function(err, myProcess){

	if(err){
		console.log(err);
		return;
	}
	
	myProcess.setLogLevel(logLevels.debug);
	
    // we start the process
    myProcess.triggerEvent("Start");
    
    setTimeout(function(){
    	console.log("tick");
    },1000);

});

var gpio = require("pi-gpio");

gpio.open(7, "output", function(err) {		// Open pin 16 for output 
	gpio.write(7, 1, function() {			// Set pin 16 high (1) 
		gpio.close(7);						// Close pin 16 
	});
});