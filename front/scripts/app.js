var app = angular.module("OmApp",["ui.router","uiGmapgoogle-maps"]);

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

app.service('Logging',function($state){
	this.logout=function(){
		localStorage.token="";
		var out = {};
		return out;
	}
});

app.factory('Dates',function(){
	return{
		getDate:function(str1)
		{
			if(!str1)
			{
				return "";
			}
			else
			{
				var dt1=str1.substring(8,10);
				var mon1=str1.substring(5,7);
				var yr1=str1.substring(0,4);
				return dt1+'-'+mon1+'-'+yr1;
			}
		}
	}
});

app.config(function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.otherwise("/home/search");
	$stateProvider.
		state('search',{
			url: '/home/search',
			views: {
				"content":{
					templateUrl:'partials/search.html',
					controller:'SearchController'
				},
				"header":{
					templateUrl:'partials/index_header.html',
				},
				"footer":{
					templateUrl:'partials/index_footer.html',
				}
			}
		}).
		state('main',{
			url: '/home/:city/:type/:locality/:fromdate/:tilldate',
			views:{
				"content": {
					templateUrl:'/outdoormonk/front/partials/home.html',
					controller:'HomeController'
				},
				"header": {
					templateUrl:'/outdoormonk/front/partials/home_header.html',
					controller:'HomeController'
				}
		    }
		}).
		state('maincampaign',{
			url: '/campaignhome/:campid/:city/:locality/:type/:check/:fromdate/:tilldate',
			views:{
				"content": {
					templateUrl:'/outdoormonk/front/partials/campaignhome.html',
					controller:'CampaignController'
				}
		    }
		}).
		state('maincampaignshare',{
			url: '/campaignshare/:campid/:city/:locality/:type',
			views:{
				"content": {
					templateUrl:'/outdoormonk/front/partials/campaignshare.html',
					controller:'CampaignController'
				},
				"header": {
					templateUrl:'/outdoormonk/front/partials/home_header.html'
				}
		    }
		}).
		state('campaignlist',{
			url: '/campaignlist/',
			views:{
				"content": {
					templateUrl:'/outdoormonk/front/partials/campaignlist.html',
					controller:'CampaignListController'
				},
				"header": {
					templateUrl:'/outdoormonk/front/partials/home_header.html'
				}
		    }
		});
});