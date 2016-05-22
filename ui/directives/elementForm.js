app.directive('elementForm', function($rootScope, workflowService, elementService) {
	return {
	    restrict: 'E',
	    scope: {
	    	data: '='
	    },
	    templateUrl: 'directives/elementForm.html',
	    link: function(scope, element, attrs){
	    	var changedOutside = false;
	    	var unregisterIdWatch = scope.$watch('data.id', function(newVal, oldVal){
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
	    	
	    	$rootScope.$on('selected_node', function(){
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