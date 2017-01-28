app.controller('SearchController', ['$scope','$http','$stateParams','$state', function ($scope,$http,$stateParams,$state) {
	$scope.search = {};
	$scope.cities = "";
	$scope.errmesg = false;

	$http({
		method:'GET',
		url:$scope.requesturl+'get_cities'
	}).
	success(function(result){
		$scope.cities = result;
	});

	$scope.searchcity = function(){
		if(!$scope.search.searchterm)
		{
			$scope.errmesg = true;
			$scope.errormessage = "Please enter a city name";
		}
		else
		{
			$http({
				method:'GET',
				url:$scope.requesturl+'check_cities',
				params:{term:$scope.search.searchterm}
			}).
			success(function(result){ 
				if(result == "0"){
					$scope.errmesg = true;
			        $scope.errormessage = "Sorry we are not operating in this city yet.We are currently operating in Hyderabad only";
				} else {
					$scope.errmesg = false;
			        $state.go('main',{'city':result,'type':'None','locality':'None','fromdate':'From','todate':'To'});
				}
			});			
		}
	}


}]);