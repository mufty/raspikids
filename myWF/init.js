var fs = require("fs");
var gpio = require('rpi-gpio');

var componentsDir = 'components/';
var workflowDir = 'wf/';

components = {};

currentActivityId = null;

var currentActivityConf = null;

var currentWorkflow;

var data = fs.readdirSync(componentsDir);
	
console.log('loading components...');

for(var i in data){
	var component = require('./' + componentsDir + data[i]);
	console.log(components);
}

var nextActivity = function(){
	var foundCurrent = false;
	for(var k in currentWorkflow){
		var a = currentWorkflow[k];
		if(!foundCurrent){
			if(k == currentActivityId){
				currentActivityId = null;
				foundCurrent = true;
			}
		} else {
			currentActivityConf = a;
			currentActivityId = k;
			break;
		}
	}
	
	if(currentActivityId){
		var activityClass = components[currentActivityConf.component];
		if(!activityClass)
			throw "Component for: " + currentActivityId + " not found";
		
		var initData = currentActivityConf.data;
		
		var activity = exports.createActivity(activityClass, initData, currentActivityConf);
	}
};

var end = false;

var stayOpen = function() {
	if(!end){
		setTimeout(stayOpen, 500);
	}
};

var cleanUp = function(){
	gpio.destroy(function() {
        console.log('All pins unexported');
    });
};

exports.startWF = function(name){
	var data = require('./' + workflowDir + name + '.json');
	
	currentWorkflow = data;
	
	for(var k in data){
		if(currentActivityId)
			break;
		
		currentActivityId = k;
		currentActivityConf = data[k];
	}
	
	var activityClass = components[currentActivityConf.component];
	if(!activityClass)
		throw "Component for: " + currentActivityId + " not found";
	
	var initData = currentActivityConf.data;
	
	var activity = exports.createActivity(activityClass, initData, currentActivityConf);
	
	stayOpen();
};

exports.createActivity = function(activityClass, initData, setting){
	return new activityClass.init(initData, function(endWF){
		if(endWF){
			cleanUp();
			end = true;
			return;
		}
		
		nextActivity();
	}, setting);
};