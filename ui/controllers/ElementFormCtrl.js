class ElementFormCtrl extends BaseController {
	
	constructor($scope, elementService) {
		super($scope);
		this.elementService = elementService;
		
		this.init();
	}
	
	init() {
		this.scope.selectedItem = this.elementService.getSelectedElement();
		this.scope.$on('selected_node', function(response, value) {
			this.scope.selectedItem = value;
			this.scope.$apply();
		}.bind(this));
	}
	
}

app.controller('ElementFormCtrl', ElementFormCtrl);