app.service('workflowService', function($rootScope) {
  var loadedWF = {data:null};
  var currentData = null;

  var setLoadedWF = function(newObj) {
	  loadedWF.data = newObj;
	  $rootScope.$broadcast('load_wf', newObj);
  };

  var getLoadedWF = function(){
      return loadedWF.data;
  };
  
  var setCurrentData = function(newObj){
	  currentData = newObj;
	  $rootScope.$broadcast('current_data_changed', newObj);
  };
  
  var updateCurrentData = function(updateObj, removeId){
	  if(updateObj){
		  if(removeId){
			  delete currentData[removeId];
		  }
		  
		  if(updateObj && updateObj.id){
			  currentData[updateObj.id] = updateObj;
		  }
		  
		  $rootScope.$broadcast('current_data_changed', currentData);
	  }
  };
  
  var getCurrentData = function(){
	  return currentData;
  };
  
  var updateStart = function(newStartId){
	  if(!currentData)
		  return;
	  
	  for(var k in currentData){
		  if(k != newStartId){
			  currentData[k].meta_data.start = false;
		  }
	  }
	  
	  $rootScope.$broadcast('current_data_changed', currentData);
  };
  
  var updateEnd = function(newEndId){
	  if(!currentData)
		  return;
	  
	  for(var k in currentData){
		  if(k != newEndId){
			  currentData[k].meta_data.end = false;
		  }
	  }
	  
	  $rootScope.$broadcast('current_data_changed', currentData);
  };

  return {
	  getLoadedWF: getLoadedWF,
	  setLoadedWF: setLoadedWF,
	  setCurrentData: setCurrentData,
	  getCurrentData: getCurrentData,
	  updateStart: updateStart,
	  updateEnd: updateEnd,
	  updateCurrentData: updateCurrentData
  };

});