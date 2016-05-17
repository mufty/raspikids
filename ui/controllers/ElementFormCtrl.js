app.controller('ElementFormCtrl', function ($scope, elementService) {
	$scope.selectedItem = elementService.getSelectedElement();
	$scope.$on('selected_node', function(response, value) {
		$scope.selectedItem = value;
		$scope.$apply();
	});
	
	/*$scope.$watch('selectedItem', function(){
		console.log($scope.selectedItem);
	});*/
});