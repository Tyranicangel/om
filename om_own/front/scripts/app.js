var app = angular.module("OmApp",["ui.router"]);

app.service('CityData',function(){
	this.cities=[];
});

app.service('LocalityData',function(){
	this.localities=[];
});

app.service('TypesData',function(){
	this.types=[];
});

app.service('MarkerData',function(){
	this.markers=[];
});

app.config(function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.otherwise("/main/Hyderabad/None/None");
	$stateProvider.
		state('main',{
			url: '/main/:city/:type/:locality',
			controller:'HomeController'
		});
});