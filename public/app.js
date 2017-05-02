angular.module('app',['smartTable'])
.controller('MainController',['$scope','$http','SmartTableModel',function($scope,$http,SmartTableModel){
	$http({
		method:'GET',
		url:'metadata.json'
	}).then(function(response){
		$scope.searchParams = {id:null,name:null};
		$scope.reset = function(){
			$scope.searchParams = {id:null,name:null};
			$scope.dataTable.resetAndReload();
		};
		$scope.apiUrlBasepath = 'http://localhost:10000/api/';
		$scope.dataTable = new SmartTableModel(response.data);
	});
}]);