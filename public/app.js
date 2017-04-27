angular.module('app',['smartTable'])
.controller('MainController',['$scope','$http','SmartTableModel',function($scope,$http,SmartTableModel){
	$http({
		method:'GET',
		url:'metadata.json'
	}).then(function(response){
		$scope.dataTable = new SmartTableModel(response.data);
		console.log($scope.dataTable);
		$scope.dataTable.page = 5;
		console.log($scope.dataTable.getCurrentBlock());
	});
}]);