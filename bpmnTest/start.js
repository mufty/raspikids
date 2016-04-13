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

/*var gpio = require("pi-gpio");

gpio.open(7, "output", function(err) { 
	gpio.write(7, 1, function() { 
		gpio.close(7); 
	});
});*/