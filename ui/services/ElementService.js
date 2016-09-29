class ElementService {
	
	constructor($rootScope) {
		this.selectedElement = {data:null};
		this.selectedLink = {data:null};
		this.rootScope = $rootScope;
	}
	
	setSelectedElement(newObj, reset) {
		//reset selection first
		if(!reset)
			this.setSelectedLink(null, true);
		  
		this.selectedElement.data = newObj;
		this.rootScope.$broadcast('selected_node', newObj);
	}
	
	getSelectedElement() {
		return this.selectedElement.data;
	}
	
	getSelectedLink() {
		return this.selectedLink.data;
	}
	
	getSelectedLink() {
		return this.selectedLink.data;
	}
	  
	setSelectedLink(newObj, reset) {
		//reset selection first
		if(!reset)
			this.setSelectedElement(null, true);
  
		this.selectedLink.data = newObj;
		this.rootScope.$broadcast('selected_link', newObj);
	}
	
}

app.service('elementService', ElementService);