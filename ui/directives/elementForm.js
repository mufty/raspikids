app.directive('elementForm', function($rootScope, workflowService, elementService) {
	return {
	    restrict: 'E',
	    scope: {
	    	data: '='
	    },
	    templateUrl: 'directives/elementForm.html',
	    link: function(scope, element, attrs){
	    	scope.exportOptions = [];
	    	
	    	scope.workflowService = workflowService;
	    	
	    	var changedOutside = false;
	    	var unregisterIdWatch = scope.$watch('data.id', function(newVal, oldVal){
	    		if(scope.data){
	    			if(scope.data.component == "TimedInputPin"){
	    				scope.exportOptions = ['', 'measurement'];
	    			}
	    			
	    			if(scope.data && scope.data.data && scope.data.data.out){
	    				for(var k in scope.data.data.out){
	    					var out = scope.data.data.out[k];
	    					if(out.export){
	    						out.targetKey = function(value){
	    							if (angular.isDefined(value)) {
	    							    //setter
	    								var originalExportValue = null;
	    								var key = null;
	    								for(var i in out.export){
	    									originalExportValue = out.export[i];
	    									key = i;
	    								}
	    								
	    								if(!originalExportValue)
	    									originalExportValue = "";
	    								
	    								out.export[value] = originalExportValue;
	    								
	    								delete out.export[key];
	    							} else {        
	    								//getter
	    								var key = null;
	    								for(var i in out.export){
	    									key = i;
	    								};
	    								return key;
	    							}
	    						};
	    						
	    						out.targetValue = function(value){
	    							if (angular.isDefined(value)) {
	    								//setter
	    								var key = null;
	    								for(var i in out.export){
	    									key = i;
	    								}
	    								
	    								out.export[key] = value;
	    							} else {
	    								//getter
	    								var originalExportValue = null;
	    								for(var i in out.export){
	    									originalExportValue = out.export[i];
	    								}
	    								
	    								if(!originalExportValue)
	    									originalExportValue = "";
	    								return originalExportValue;
	    							}
	    						};
	    					}
	    				}
	    			}
		    	}
	    		
	    		if(changedOutside){
	    			changedOutside = false;
	    			return;
	    		}
	    		
	    		var currentData = scope.data;
	    		if(!currentData || !oldVal || !newVal)
	    			return;
	    		
	    		var d = workflowService.getCurrentData();
	    		
	    		//update connections
	    		for(var k in d){
	    			if(d[k].data && d[k].data.out){
	    				for(var i in d[k].data.out){
	    					var out = d[k].data.out[i];
	    					if(out.target == oldVal)
	    						out.target = newVal;
	    				}
	    			}
	    		}
	    		
	    		workflowService.updateCurrentData(currentData, oldVal);
	    	});
	    	
	    	$rootScope.$on('selected_node', function(d){
	    		changedOutside = true;
	    	});
	    	
	    	scope.showPin = function(){
	    		if(scope.data && scope.data.component == "Pin")
	    			return true;
	    		
	    		return false;
	    	};
	    	
	    	scope.showTIP = function(){
	    		if(scope.data && scope.data.component == "TimedInputPin")
	    			return true;
	    		
	    		return false;
	    	};
	    	
	    	var _initExports = function(){
	    		if(!scope.data || !scope.data.data)
	    			return;
	    		
	    		if(!scope.data.data.out)
	    			scope.data.data.out = [];
	    	};
	    	
	    	scope.addExport = function(){
	    		_initExports();
	    		
	    		scope.data.data.out.push({
	    			"target":"",
	    			"export":{
	    				"":""
	    			}
	    		});
	    	};
	    	
	    	scope.removeExport = function(obj){
	    		_initExports();
	    		
	    		var outs = scope.data.data.out;
	    		
	    		if(outs.indexOf(obj) > -1){
	    			var index = outs.indexOf(obj);
    				outs.splice(index, 1);
	    		}
	    		
	    		console.log(outs);
	    	};
	    	
	    	scope.showExports = function(){
	    		if(!scope.data || !scope.data.data || !scope.data.data.out)
	    			return false;
	    		
	    		if(scope.data.component == "TimedInputPin")
	    			return true;
	    		else
	    			return false;
	    	};
	    	
	    	scope.getOutputIds = function(){
	    		if(!scope.data || !scope.data.data || !scope.data.data.out)
	    			return [];
	    		
	    		var ret = [];
	    		
    			for(var k in scope.data.data.out){
    				var out = scope.data.data.out[k];
    				if(ret.indexOf(out.target) == -1)
    					ret.push(out.target);
	    		}
	    			
	    		return ret;
	    	};
	    	
	    	scope.inputOptions = function(target){
	    		var data = workflowService.getCurrentData();
	    		for(var k in data){
	    			if(k == target){
	    				var d = data[k];
	    				if(d.component == 'Pin'){
	    					return ['', 'time'];
	    				}
	    			}
	    		}
	    		return [];
	    	};
	    	
	    	scope.$watch('data.meta_data.start', function(newVal, oldVal){
	    		if(scope.data && newVal === true)
	    			workflowService.updateStart(scope.data.id);
	    	});
	    	
	    	scope.$watch('data.meta_data.end', function(newVal, oldVal){
	    		if(scope.data && newVal === true)
	    			workflowService.updateEnd(scope.data.id);
	    	});
	    }
	};
});