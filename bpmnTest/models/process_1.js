var gpio = require("pi-gpio");

exports.Start = function(data, done) {
	// called after the start event arrived at MyStart
	done(data);
};

exports.GPIOon7 = function(data, done) {
	var myName = arguments.callee.toString();
	console.log(myName);
	var gpioNum = 7;
	gpio.open(gpioNum, "output", function(err) { 
		gpio.write(gpioNum, 1, function() {
			gpio.close(gpioNum);
			done(data);
		});
	});
};

exports.GPIOoff7 = function(data, done) {
	var gpioNum = 7;
	gpio.open(gpioNum, "output", function(err) { 
		gpio.write(gpioNum, 0, function() {
			gpio.close(gpioNum);
			done(data);
		});
	});
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
