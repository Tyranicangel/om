app.controller("MainController",function($scope,$http){
	$scope.requesturl='http://localhost/monk/om_own/back/public/';
});

app.controller("HomeController",function($scope,$http,$stateParams,$state,TypesData,CityData,LocalityData){

	//Initial Map Data
	$scope.orginal_price=100;
	$scope.selected=false;
	$scope.locationflag=false;
	$scope.locality="Select Locality";
	$scope.localityflag=false;

	//Initializing city
	if($stateParams.city=='')
	{
		$scope.city='Hyderabad';
	}
	else
	{
		$scope.city=$stateParams.city;
	}


	//Initializing types
	$scope.mtype=$stateParams.type
	if($stateParams.type=='')
	{
		$scope.maintype=[];
	}
	else if($stateParams.type=='None')
	{
		$scope.maintype=[];
	}
	else
	{
		$scope.maintype=JSON.parse($stateParams.type);
	}

	//Initializing Locality
	$scope.mlocality=$stateParams.locality;
	if($stateParams.locality=='')
	{
		$scope.mainlocality=[];
	}
	else if($stateParams.locality=='None')
	{
		$scope.mainlocality=[];
	}
	else if($stateParams.locality=='All')
	{
		$scope.mainlocality=[];
		$scope.locality='All';
		$scope.all_localities=true;
	}
	else
	{
		$scope.mainlocality=JSON.parse($stateParams.locality);
		$scope.all_localities=false;
		if($scope.mainlocality.length==1)
		{
			$scope.locality=$scope.mainlocality[0];
		}
		else
		{
			$scope.locality='Custom';
		}
	}

	//Getting Marker Data
	$scope.mainmarkers=[];
	$http({
		method:'GET',
		url:$scope.requesturl+'get_markers',
		params:{city:$scope.city}
	}).
	success(function(result){
		$scope.markerdata=result;
		angular.forEach($scope.markerdata,function(m){
			m.showbook=false;
			m.showorigin=false;
			m.showmy=false;
			if($scope.maintype.length==0)
			{
				if($scope.mainlocality.length==0)
				{
					$scope.mainmarkers.push(m);
				}
				else
				{
					if($scope.mainlocality.indexOf(m.localities.name)>=0)
					{
						$scope.mainmarkers.push(m);
					}
				}
			}
			else
			{
				if($scope.maintype.indexOf(m.types.name)>=0)
				{
					if($scope.mainlocality.length==0)
					{
						$scope.mainmarkers.push(m);
					}
					else
					{
						if($scope.mainlocality.indexOf(m.localities.name)>=0)
						{
							$scope.mainmarkers.push(m);
						}
					}
				}
			}
		});
	});

	//Dropdown click elsewhere
	$(document).click(function(e){
		if($(e.target).parents('.city_select_wrap').length==0)
		{
			$scope.locationflag=false;
		}
		if($(e.target).parents('.locality_select_wrap').length==0)
		{
			$scope.localityflag=false;
		}
		$scope.$apply();
	});

	//Getting Types data
	if(TypesData.types.length==0)
	{
		$http({
			method:'GET',
			url:$scope.requesturl+'get_types'
		}).
		success(function(result){
			TypesData.types=result;
			$scope.types=result;
			angular.forEach($scope.types,function(type){
				if($scope.maintype.indexOf(type.name)>=0)
				{
					type.check=true;
				}
				else
				{
					type.check=false;
				}
			});
		});
	}
	else
	{
		$scope.types=TypesData.types;
		angular.forEach($scope.types,function(type){
			if($scope.maintype.indexOf(type.name)>=0)
			{
				type.check=true;
			}
			else
			{
				type.check=false;
			}
		});
	}

	$scope.locality_change=function(locality){
		if(!locality.check)
		{
			$scope.mainlocality.splice($scope.mainlocality.indexOf(locality.name),1)
			if($scope.mainlocality.length==0)
			{
				$scope.mlocality='None';
			}
			else
			{
				$scope.mlocality=JSON.stringify($scope.mainlocality);
			}
		}
		else
		{
			$scope.mainlocality.push(locality.name);
			if($scope.mainlocality.length==$scope.localities.length)
			{
				$scope.mlocality='All';
			}
			else
			{
				$scope.mlocality=JSON.stringify($scope.mainlocality);
			}
		}
		$state.go('main',{'city':$scope.city,'type':$scope.mtype,'locality':$scope.mlocality});
	}

	//Getting City Data
	if(CityData.cities.length==0)
	{
		$http({
			method:'GET',
			url:$scope.requesturl+'get_cities'
		}).
		success(function(result){
			CityData.cities=result;
			$scope.cities=result;
			angular.forEach($scope.cities,function(city){
				if(city.name==$scope.city)
				{
					$scope.localities=city.localities;
				}
			});
			$scope.loc_count=0;
			angular.forEach($scope.localities,function(locality){
				if($scope.locality=='All')
				{
					locality.check=true;
					$scope.mainlocality.push(locality.name);
				}
				else
				{
					if($scope.mainlocality.indexOf(locality.name)>=0)
					{
						locality.check=true;
						$scope.loc_count++;
					}
					else
					{
						locality.check=false;
					}
				}
			});
			if($scope.loc_count==$scope.localities.length)
			{
				$scope.locality='All';
				$scope.all_localities=true;
			}
		});
	}
	else
	{
		$scope.cities=CityData.cities;
		angular.forEach($scope.cities,function(city){
			if(city.name==$scope.city)
			{
				$scope.localities=city.localities;
			}
		});
		$scope.loc_count=0;
		angular.forEach($scope.localities,function(locality){
			if($scope.locality=='All')
			{
				locality.check=true;
				$scope.mainlocality.push(locality.name);
			}
			else
			{
				if($scope.mainlocality.indexOf(locality.name)>=0)
				{
					locality.check=true;
					$scope.loc_count++;
				}
				else
				{
					locality.check=false;
				}
			}
		});
		if($scope.loc_count==$scope.localities.length)
		{
			$scope.locality='All';
			$scope.all_localities=true;
		}
	}

	$scope.select_all=function()
	{
		if($scope.all_localities)
		{
			$state.go('main',{'city':$scope.city,'type':$scope.mtype,'locality':'All'});
		}
		else
		{
			$state.go('main',{'city':$scope.city,'type':$scope.mtype,'locality':'None'});
		}
	}

	//Changing type
	$scope.change_type=function(type){
		if(!type.check)
		{
			$scope.maintype.splice($scope.maintype.indexOf(type.name),1);
			if($scope.maintype.length==0)
			{
				$scope.mtype='None';
			}
			else
			{
				$scope.mtype=JSON.stringify($scope.maintype);	
			}
		}
		else
		{
			$scope.maintype.push(type.name);
			$scope.mtype=JSON.stringify($scope.maintype);
		}
		$state.go('main',{'city':$scope.city,'type':$scope.mtype,'locality':$scope.mlocality});
	}

	//City drop down
	$scope.location_drop=function(){
		if($scope.locationflag==true)
		{
			$scope.locationflag=false;
		}
		else{
			$scope.locationflag=true;
		}
	}

	$scope.locality_drop=function(){
		if($scope.localityflag==true){
			$scope.localityflag=false;
		}
		else{
			$scope.localityflag=true;
		}
	}

	$scope.show_bookings=function(m){
		m.showbook=true;
	}

	$scope.hide_bookings=function(m){
		m.showbook=false;
	}

	$scope.show_origin_edit=function(m){
		m.showorigin=true;
	}

	$scope.hide_origin_edit=function(m){
		m.showorigin=false;
		$http({
			method:'POST',
			url:$scope.requesturl+'update_origin',
			data:{id:m.id,price:m.orginal_price}
		})
	}

	$scope.show_my_edit=function(m){
		m.showmy=true;
	}

	$scope.hide_my_edit=function(m){
		m.showmy=false;
		$http({
			method:'POST',
			url:$scope.requesturl+'update_my',
			data:{id:m.id,price:m.my_price}
		})
	}

});
