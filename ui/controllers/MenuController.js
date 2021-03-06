var fs = require('fs');

var crud = require('../ui/crud.js');
const spawn = require('child_process').spawn;

class MenuController extends BaseController {
	
	constructor($scope, $rootScope, elementService, workflowService) {
		super($scope);
		this.workflowDir = 'wf/';
		this.scope.selectedLink = false;
		this.rootScope = $rootScope;
		this.elementService = elementService;
		this.workflowService = workflowService;
		this.currentChildProcess = null;
		
		this.init();
	}
	
	init() {
		fs.readdir(this.workflowDir, function (err, data) {
			if (err) throw err;
			
			this.scope.data = data;
			this.scope.$apply();
		}.bind(this));
		
		this.rootScope.$on('selected_link', function(e, d){
			if(d)
				this.scope.selectedLink = true;
			else
				this.scope.selectedLink = false;
			
			this.scope.$apply();
		}.bind(this));

		this.scope.loadWorkflow = this.loadWorkflow.bind(this);
		this.scope.save = this.save.bind(this);
		this.scope.start = this.start.bind(this);
		this.scope.removeLink = this.removeLink.bind(this);
	}
	
	loadWorkflow(d) {
		this.workflowService.setLoadedWF(d);
	}
	
	removeLink() {
		var selectedLink = this.elementService.getSelectedLink();
		if(selectedLink){
			var sourceId = selectedLink.source.id;
			var targetId = selectedLink.target.id;
			var wf = this.workflowService.getCurrentData();
			
			var wfElement = wf[sourceId];
			
			if(wfElement && wfElement.data && wfElement.data.out){
				for(var i in wfElement.data.out){
					var o = wfElement.data.out[i];
					if(o.target == targetId){
						wfElement.data.out.splice(parseInt(i), 1);
					}
				}
			}
		
			this.workflowService.updateCurrentData();
		}
	}
	
	save() {
		var data = this.workflowService.getCurrentData();
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
		
		if(this.workflowService.getLoadedWF() && data)
			crud.save(data, workflowService.getLoadedWF());
	}
	start() {
		if(this.workflowService.getLoadedWF()){
			if(this.currentChildProcess){
				console.log("child process already running kill it!");
				this.currentChildProcess.kill();
			}
			
			console.log("starting child process");
			this.currentChildProcess = spawn('raspi-kids-wf', [this.workflowService.getLoadedWF().replace('.json','')]);
			
			this.currentChildProcess.stdout.on('data', (data) => {
				  console.log('stdout: ${data}');
			});
			
			this.currentChildProcess.stderr.on('data', (data) => {
				  console.log('stderr: ${data}');
			});
			
			this.currentChildProcess.on('close', (code) => {
				  console.log('child process exited with code ${code}');
			});
		}
	}
	
}

app.controller('MenuController', MenuController);