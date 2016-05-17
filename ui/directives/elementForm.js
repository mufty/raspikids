app.directive('elementForm', function(workflowService) {
	return {
	    restrict: 'E',
	    scope: {
	    	data: '='
	    },
	    templateUrl: 'directives/elementForm.html',
	    link: function(scope, element, attrs){
	    	scope.$watch('data.id', function(newVal, oldVal){
	    		var currentData = workflowService.getCurrentData();
	    		if(!currentData || !oldVal || !newVal)
	    			return;
	    		
	    		var obj = currentData[oldVal];
	    		currentData[newVal] = obj;
	    		delete currentData[oldVal];
	    		
	    		//update connections
	    		for(var k in currentData){
	    			if(currentData[k].data && currentData[k].data.out){
	    				for(var i in currentData[k].data.out){
	    					var out = currentData[k].data.out[i];
	    					if(out.target == oldVal)
	    						out.target = newVal;
	    				}
	    			}
	    		}
	    		
	    		workflowService.setCurrentData(currentData);
	    	});
	    	scope.doShow = function(val, key){
	    		if(key && key == 'meta_data')
	    			return true;
	    		
	    		if(typeof(val) != 'object')
	    			return true;
	    		
	    		return false;
	    	};
	    	
	    	scope.isString = function(val){
	    		if(typeof(val) == 'string')
	    			return true;
	    		
	    		return false;
	    	};
	    	
	    	scope.isBoolean = function(val){
	    		if(typeof(val) == 'boolean')
	    			return true;
	    		
	    		return false;
	    	};
	    }
	};
});