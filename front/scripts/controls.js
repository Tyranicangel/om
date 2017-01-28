app.controller("MapController",function($scope,$rootScope,LocationService){
	var google_map;

	$rootScope.$watch('latlongs', function(){
		$scope.center = {latitude:17.385044, longitude:78.486671};
		if(google_map)
		{
			change_map();
		}
		else
		{
			initialize();
		}
	}, true);
	
	var bounds = null;

	function initialize()
	{
		var map_options = {
			center: new google.maps.LatLng($rootScope.latlongs[0],$rootScope.latlongs[1]),
			zoom: 15,
			minZoom:9,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.SMALL
			},
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		

		google_map = new google.maps.Map(document.getElementById("map_canvas"), map_options);
		google_map.setOptions({styles: $scope.opt.styles});
	}

	function change_map()
	{
		google_map.setCenter(new google.maps.LatLng($rootScope.latlongs[0],$rootScope.latlongs[1]));
	}

	function drawCircle(point, radius, dir) { 
		var d2r = Math.PI / 180;   // degrees to radians 
		var r2d = 180 / Math.PI;   // radians to degrees 
		var earthsradius = 3963; // 3963 is the radius of the earth in miles
		var points = 32; 
		
		// find the raidus in lat/lon 
		var rlat = (radius / earthsradius) * r2d; 
		var rlng = rlat / Math.cos(point.lat() * d2r); 

		var extp = new Array(); 
		if (dir==1)	{var start=0;var end=points+1} // one extra here makes sure we connect the
		else{var start=points+1;var end=0}
		for (var i=start; (dir==1 ? i < end : i > end); i=i+dir)  
		{
			var theta = Math.PI * (i / (points/2)); 
			ey = point.lng() + (rlng * Math.cos(theta)); // center a + radius x * cos(theta) 
			ex = point.lat() + (rlat * Math.sin(theta)); // center b + radius y * sin(theta) 
			extp.push(new google.maps.LatLng(ex, ey)); 
			bounds.extend(extp[extp.length-1]);
		}
		return extp;
	}
});

