var fs = require('fs');

var crud = require('../ui/crud.js');
const spawn = require('child_process').spawn;

app.controller('MenuController', function ($scope, elementService, workflowService) {
	var workflowDir = 'wf/';
	
	fs.readdir(workflowDir, function (err, data) {
		if (err) throw err;
		
		$scope.data = data;
		$scope.$apply();
	});
	
	$scope.loadWorkflow = function(d){
		workflowService.setLoadedWF(d);
	};
	
	$scope.save = function(){
		//test for start nodes
		var data = workflowService.getCurrentData();
		if(data){
			var foundStart = false
			for(var k in data){
				var d = data[k];
				if(d.meta_data.start)
					foundStart = true;
			}
			
			if(!foundStart){
				alert("Missing a starting node! Please mark one as start before saving.");
				return;
			}
		}
		
		if(workflowService.getLoadedWF() && data)
			crud.save(data, workflowService.getLoadedWF());
	};
	
	var currentChildProcess;
	
	$scope.start = function(){
		if(workflowService.getLoadedWF()){
			if(currentChildProcess){
				console.log("child process already running kill it!");
				currentChildProcess.kill();
			}
			
			console.log("starting child process");
			currentChildProcess = spawn('raspi-kids-wf', [workflowService.getLoadedWF().replace('.json','')]);
			
			currentChildProcess.stdout.on('data', (data) => {
				  console.log(`stdout: ${data}`);
			});
			
			currentChildProcess.stderr.on('data', (data) => {
				  console.log(`stderr: ${data}`);
			});
			
			currentChildProcess.on('close', (code) => {
				  console.log(`child process exited with code ${code}`);
			});
		}
	};
});