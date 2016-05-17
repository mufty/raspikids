app.service('elementService', function($rootScope) {
  var selectedElement = {data:null};

  var setSelectedElement = function(newObj) {
	  selectedElement.data = newObj;
	  $rootScope.$broadcast('selected_node', newObj);
  };

  var getSelectedElement = function(){
      return selectedElement.data;
  };

  return {
	  setSelectedElement: setSelectedElement,
	  getSelectedElement: getSelectedElement
  };

});