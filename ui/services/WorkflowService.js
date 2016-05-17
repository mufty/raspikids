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
  
  var getCurrentData = function(){
	  return currentData;
  };

  return {
	  getLoadedWF: getLoadedWF,
	  setLoadedWF: setLoadedWF,
	  setCurrentData: setCurrentData,
	  getCurrentData: getCurrentData
  };

});