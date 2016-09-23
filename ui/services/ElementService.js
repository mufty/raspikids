app.service('elementService', function($rootScope) {
  var selectedElement = {data:null};
  var selectedLink = {data:null};

  var setSelectedElement = function(newObj, reset) {
	  //reset selection first
	  if(!reset)
		  setSelectedLink(null, true);
	  
	  selectedElement.data = newObj;
	  $rootScope.$broadcast('selected_node', newObj);
  };

  var getSelectedElement = function(){
      return selectedElement.data;
  };
  
  var getSelectedLink = function(){
	  return selectedLink.data;
  }
  
  var setSelectedLink = function(newObj, reset){
	  //reset selection first
	  if(!reset)
		  setSelectedElement(null, true);
	  
	  selectedLink.data = newObj;
	  $rootScope.$broadcast('selected_link', newObj);
  }
  

  return {
	  setSelectedElement: setSelectedElement,
	  getSelectedElement: getSelectedElement,
	  setSelectedLink: setSelectedLink,
	  getSelectedLink: getSelectedLink
  };

});