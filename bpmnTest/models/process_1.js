var gpio = require("pi-gpio");

exports.Start = function(data, done) {
	// called after the start event arrived at MyStart
	done(data);
};

exports.GPIOon7 = function(data, done) {
	this.gpioNum = 7;
	//data.gpioNum = 7;
	/*gpio.open(this.gpioNum, "output", function(err) { 
		gpio.write(this.gpioNum, 1, function() {
			done(data);
		});
	});*/
	
};

exports.GPIOon7Done = function(data, done) {
	console.log(this.gpioNum);
	//gpio.close(this.gpioNum);
	done(data);
};

exports.MyTask2 = function(data, done) {
	// called at the beginning of MyTask
	console.log("TASK 2", data);
	done(data);
};

exports.Is_it_ok = function(data, done){
	done(data);
};

var testData = function(property, data, value){
	if(data && data[property] && data[property] === value){
		console.log("ok");
		return true;
	} else {
		console.log("nok");
		return false;
	}
}

exports.Is_it_ok$ok = function(data){
	return testData("test", data, "test data");
};

exports.Is_it_ok$nok = function(data){
	return testData("test", data, "test data");
};

exports.End = function(data, done) {
	// Called after MyEnd has been reached
	console.log("end");
	done(data);
}; 
