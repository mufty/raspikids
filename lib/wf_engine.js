var fs = require("fs");
var merge = require('merge');

componentsDir = 'components/';
workflowDir = process.cwd() + '/wf/';

components = {};

var initializedWorkflow = {};

var data = fs.readdirSync(__dirname + "/../" + componentsDir);
	
console.log('loading components...');

for(var i in data){
	var component = require('../' + componentsDir + data[i]);
	console.log(components);
}

var nextActivity = function(target, data){
	if(!target)
		throw "No target specified for next activity";
	
	var activity = initializedWorkflow[target];
	
	var initData = activity.initData;
	
	if(data && initData.input){
		initData.input = merge.recursive(true, initData.input, data);
		
		console.log("merge: " + initData.input.time);
	}
	
	setTimeout(function(){
		activity.startUp();
	});
};

var end = false;

var stayOpen = function() {
	if(!end){
		setTimeout(stayOpen, 500);
	} else {
		console.log("All processes ended");
	}
};

var cleanUp = function(){
	gpio.destroy(function() {
        console.log('All pins unexported');
    });
};

exports.startWF = function(name){
	console.log("loading wf: " + name);
	var data = require(workflowDir + name + '.json');
	
	console.log("loaded wf: " + name);
	
	initializedWorkflow = {};
	
	var currentWorkflow;
	var firstId = null;
	var currentActivityId = null;
	var currentActivityConf = null;
	
	
	currentWorkflow = data;
	
	console.info('initializing workflow components...');
	
	for(var k in data){
		if(!firstId)
			firstId = k;
		
		currentActivityId = k;
		currentActivityConf = data[k];
		currentActivityConf.id = k;
		
		console.info('init component ' + currentActivityConf.component + ' with ID: ' + k);
		
		var activityClass = components[currentActivityConf.component];
		if(!activityClass)
			throw "Component for: " + currentActivityId + " not found";
	
		var initData = currentActivityConf.data;
		
		initializedWorkflow[k] = exports.createActivity(activityClass, initData, currentActivityConf);
		
	}
	
	nextActivity(firstId);
	
	stayOpen();
};

exports.createActivity = function(activityClass, initData, setting){
	return new activityClass(initData, function(endWF, target, data){
		if(endWF){
			cleanUp();
			end = true;
			return;
		}
		
		nextActivity(target, data);
	}, setting);
};