app.controller("MainController",function($scope,$http,$state,$rootScope,$stateParams,Logging){
	$scope.requesturl='http://localhost/outdoormonk/back/public/';
	
	$scope.todate='2015-01-01';
	function leapYear(year)
	{
		return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
	}
	$http({
		method:'GET',
		url:$scope.requesturl+'/get_cdate',
		params:{city:$scope.city}
	}).success(function(result){

		$scope.todate=result;
		td=parseInt($scope.todate.substring(0,4));
		if(leapYear(td+1))
		{
			arr=[[30,4,0],[31,5,0],[30,6,0],[31,7,0],[31,8,0],[30,9,0],[31,10,0],[30,11,0],[31,12,0],[31,1,1],[29,2,1],[31,3,1]];
		}
		else
		{
			arr=[[30,4,0],[31,5,0],[30,6,0],[31,7,0],[31,8,0],[30,9,0],[31,10,0],[30,11,0],[31,12,0],[31,1,1],[28,2,1],[31,3,1]];
		}
		hd=new Date($scope.todate);
		if(arr[hd.getMonth()][1] < 10) {

			$scope.maxdate=(td+arr[hd.getMonth()][2])+'-0'+arr[hd.getMonth()][1]+'-'+arr[hd.getMonth()][0];
		} else {

			$scope.maxdate=(td+arr[hd.getMonth()][2])+'-'+arr[hd.getMonth()][1]+'-'+arr[hd.getMonth()][0];
		}
		
		
	});


	function logout() {
		localStorage.token = "";
	}

	$scope.popupwrapper = false;
	$scope.popupsignin = false;
	$scope.popupsignup = false;
	$scope.popupforgot = false;
	$scope.popupchangepass = false;
	$scope.registererror = false;
	$scope.loginerror = false;
	$scope.bookthisad = false;
	$scope.adthistocampaign = false;
	$scope.bookclickcheck = false;
	$scope.campaignclickcheck = false;
	$scope.createnewcampaign = false;
	$scope.mainasset = {};
	$scope.user={};

	if(localStorage.token != "") {
		$http({
		method:'GET',
		url:$scope.requesturl+'get_user',
		headers:{'X-CSRFToken':localStorage.token}
		}).
		success(function(result){ 
			if(result[0]) {
			 $scope.user = result[0];

			} else {

				$scope.user = {};
			}
		});
	}	else {

			$state.go("search");
	}

	$scope.loginclick = function() {
		$scope.popupwrapper = true;
	    $scope.popupsignin = true;
	}

	function closeallpopup() {
		$scope.popupsignin = false;
		$scope.popupsignup = false;
		$scope.popupforgot = false;
		$scope.popupchangepass = false;
		$scope.bookthisad = false;
		$scope.adthistocampaign = false;
		$scope.createnewcampaign = false;
	}

	$scope.closepopup = function() {
		$scope.popupwrapper = false;
		$scope.popupsignin = false;
		$scope.popupsignup = false;
		$scope.popupforgot = false;
		$scope.popupchangepass = false;
		$scope.bookthisad = false;
		$scope.adthistocampaign = false;
		$scope.createnewcampaign = false;
	}

	$scope.opensignup = function() {
		closeallpopup();
		$scope.popupsignup = true;
	}

	$scope.opensignin = function() {
		closeallpopup();
		$scope.popupsignin = true;
	}

	$scope.changepass = function() {
		closeallpopup();
		$scope.popupwrapper = true;
		$scope.popupchangepass = true;
	}

	$scope.openforgot = function() {
		closeallpopup();
		$scope.popupforgot = true;
	}

	$scope.logoutclick = function() {
		$scope.user = Logging.logout();
	}

	$scope.hoverIn = function() {

		$scope.hovervar = true;
	}

	$scope.hoverOut = function() {

		$scope.hovervar = false;
	}

	$scope.registeruser = function() {
		if(!$scope.user.username){
			$scope.registererror = true;
			$scope.registermessage = "Please enter user name";
		} else if(!$scope.user.email){
			$scope.registererror = true;
			$scope.registermessage = "Please enter email address";
		} else if(!$scope.user.phoneno){
			$scope.registererror = true;
			$scope.registermessage = "Please enter your phone number";
		} else if (!$scope.user.password) {
			$scope.registererror = true;
			$scope.registermessage = "Please enter password";
		} else if (!$scope.user.repeatpassword) {
			$scope.registererror = true;
			$scope.registermessage = "Please repeat password";
		} else if ($scope.user.password != $scope.user.repeatpassword) {
			$scope.registererror = true;
			$scope.registermessage = "Passwords do not match";
		} else {
			$scope.registererror = false;
			$http({
				method:'POST',
				url:$scope.requesturl+'register_user',
				data:$scope.user
			}).
			success(function(result){ 
				if(result == "1") {
					$scope.opensignin();
					$scope.loginerror = true;
					$scope.loginmessage = "Registered successfully! You can login now.";
				} else if(result == "2"){
					$scope.registererror = true;
					$scope.registermessage = "User already exist! Please try some other user name.";
				} else {
					$scope.registererror = true;
					$scope.registermessage = "Registration failed";
				}
			});
		}
	}

	$scope.some = function() {

	}

	$scope.loginuser = function() {
		if(!$scope.user.loginname) {
			$scope.loginerror = true;
			$scope.loginmessage = "Please enter user name";
		} else if (!$scope.user.loginpass) {
			$scope.loginerror = true;
			$scope.loginmessage = "Please enter password";
		} else {
			$scope.loginerror = false;
			$http({
				method:'POST',
				url:$scope.requesturl+'login_user',
				data:$scope.user
			}).
			success(function(result){ 
				console.log(result);
				if(result == "2") {
					$scope.loginerror = true;
					$scope.loginmessage = "Wrong username/password";
				} else if(result == "0"){
					$scope.loginerror = true;
					$scope.loginmessage = "Login failed";
				} else {
					localStorage.token = result[0]['token'];
					$scope.loginerror = false;
					if($scope.bookclickcheck) {

						closeallpopup();
						$scope.bookthisad = true;
					} else if($scope.campaignclickcheck){

						closeallpopup();
						$scope.adthistocampaign = true;
					} else {
						$scope.closepopup();
					}
					$scope.user = result[0];
				}
			});
		}
	}
	$scope.changeuserpass = function() {

		if(!$scope.user.currentpass) {

			$scope.changepasserror = true;
			$scope.loginmessage = "Please enter the current password";
		} else if (!$scope.user.newpass) {
			$scope.changepasserror = true;
			$scope.loginmessage = "Please enter new password";
		} else if (!$scope.user.newpass2) {
			$scope.changepasserror = true;
			$scope.loginmessage = "Please repeat new password";
		} else if ($scope.user.newpass != $scope.user.newpass2) {
			$scope.changepasserror = true;
			$scope.loginmessage = "Password do not match";
		} else {

			$scope.changepasserror = false;

			$http({
				method:'POST',
				headers:{'X-CSRFToken':localStorage.token},
				url:$scope.requesturl+'change_user_pass',
				data:$scope.user
			}).
			success(function(result){ 

				console.log(result);

				if(result == "2") {
					$scope.changepasserror = true;
					$scope.loginmessage = "Current password wrong!";
				} else if(result == "0"){
					$scope.changepasserror = true;
					$scope.loginmessage = "Login failed";
				} else {
					$scope.changepasserror = true;
					$scope.loginmessage = "Password changes successfully!";
				}
				

			});
		}
	}

	
});

app.controller("HomeController",function($scope,$http,$stateParams,$state,TypesData,CityData,LocalityData,$rootScope, Dates){
	$scope.selected=false;
	$scope.pos={latitude:17.424986, longitude:78.475428};
	$scope.mapcenter = {latitude:17.424986, longitude:78.475428};
	$scope.locationflag=false;
	$scope.locality="Select Locality";
	$scope.localityflag=false;
	$scope.mapzoom = 13;
	$scope.mapfill={color:'#000000',opacity:'0.3'};
	$scope.mapstroke={color:'#000000',opacity:'0.4',weight: 1};
	$scope.visible = false;
	$scope.maprad=1000;
	if($stateParams.city=='')
	{
		$scope.city='Hyderabad';
	}
	else
	{
		$scope.city=$stateParams.city;
	}
	if($stateParams.fromdate=='')
	{
		$scope.fdate='From';
	}
	else
	{
		$scope.fdate=$stateParams.fromdate;
	}
	if($stateParams.tilldate=='')
	{
		$scope.tdate='To';
	}
	else
	{
		$scope.tdate=$stateParams.tilldate;
	}
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
	$scope.sliderimg=$scope.requesturl+'/uploads/img8.jpg';

	function daysBetween( date1, date2 ) {

		var splitdate1 = date1.split("-");
		var splitdate2 = date2.split("-");

		var dateconv1  = new Date(splitdate1[0], splitdate1[1]-1, splitdate1[2]); 
		var dateform1 = new Date(dateconv1.getFullYear(), dateconv1.getMonth(), dateconv1.getDate());

		var dateconv2  = new Date(splitdate2[0], splitdate2[1]-1, splitdate2[2]); 
		var dateform2 = new Date(dateconv2.getFullYear(), dateconv2.getMonth(), dateconv2.getDate());


	  //Get 1 day in milliseconds
	  var one_day=1000*60*60*24;

	  // Convert both dates to milliseconds
	  var date1_ms = dateconv1.getTime();
	  var date2_ms = dateconv2.getTime();

	  // Calculate the difference in milliseconds
	  var difference_ms = Math.abs(date2_ms - date1_ms);
	    
	  // Convert back to days and return
	  return Math.round(difference_ms/one_day); 
	}

	setTimeout(function(){

		$scope.mainmarkers=[];
		$scope.mainmarkers2=[];
		$scope.tsdate = $scope.$parent.maxdate;
		$scope.fsdate = $scope.$parent.todate;
		console.log($scope.fsdate);
		var lastenddate = "";
		$http({
			method:'GET',
			url:$scope.requesturl+'/get_markers',
			params:{city:$scope.city}
		}). 
		success(function(result){
			// console.log(result);

			if($scope.fdate=='From')
			{
				var nfdate=$scope.todate;
			}
			else
			{
				var nfdate=$scope.fdate.substring(6,11)+'-'+$scope.fdate.substring(3,5)+'-'+$scope.fdate.substring(0,2);
			}
			if($scope.tdate=='To')
			{
				var ntdate=$scope.maxdate;
			}
			else
			{
				var ntdate=$scope.tdate.substring(6,11)+'-'+$scope.tdate.substring(3,5)+'-'+$scope.tdate.substring(0,2);
			}
			//console.log(ntdate);
			$scope.markerdata=result;
			angular.forEach($scope.markerdata,function(m){

				m.icon = "images/markeryellow.png";
				var bookingth=m.booking;
				var bookingarr = [];
				var diffd = 0;

				if(m.booking.length > 0) {

					if(m.booking.length == 1) {

						var diffd = daysBetween(m.booking[0]['bookend'],$scope.tsdate);

						if(diffd >= 30) {
							bookingarr.push(m.booking[0]['bookend']+':'+$scope.tsdate);
						}

					} else {

						var cloop = 1;

						angular.forEach(m.booking,function(vb){

							if(cloop > 1){

								if(cloop == m.booking.length) {

									var diffd = daysBetween(lastenddate,vb.bookstart);

									if(diffd >= 30) {
										bookingarr.push(lastenddate+':'+vb.bookstart);
									}

									var diffd = daysBetween(vb.bookend,$scope.tsdate);

									if(diffd >= 30) {
										bookingarr.push(vb.bookend+':'+$scope.tsdate);
									}
								} else {

									var diffd = daysBetween(lastenddate,vb.bookstart);

									if(diffd >= 30) {
										bookingarr.push(lastenddate+':'+vb.bookstart);
									}

								} 

							} else {

								if(vb.bookstart > $scope.fsdate) {

									var diffd = daysBetween(vb.bookstart, $scope.fsdate);

									if(diffd >= 30) {

										bookingarr.push(vb.bookstart+':'+$scope.fsdate);
									}
								} 

							}


							cloop = cloop + 1;
							lastenddate = vb.bookend;
						});
					}



				} else {

					bookingarr.push($scope.fsdate+':'+$scope.tsdate);
				}
				m.freebook = [];
				m.freebook.push(bookingarr);

				//changing icon according to availability
				var checkgreen = 0;
				var checkred = 0;
				var checkyellow = 0;

				angular.forEach(bookingarr,function(ba){

					var basplit = ba.split(":");

					if((nfdate >= basplit[0] && nfdate <= basplit[1]) && (ntdate >= basplit[0] && ntdate <= basplit[1])){

						checkgreen = checkgreen+1;
					} else if(((nfdate > basplit[0] && nfdate > basplit[1]) || (nfdate < basplit[0] && nfdate < basplit[1])) && ((ntdate > basplit[0] && ntdate > basplit[1]) || (ntdate < basplit[0] && ntdate < basplit[1])))
					{

						checkred = checkred+1;
					}
				});
				if(checkgreen > 0) {

					m.icon = "images/markergreen.png";
				} 
				else if(checkred == bookingarr.length) {

					m.icon = "images/markerred.png";
				}

				m.coords={latitude:m.latitude,longitude:m.longitude};
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

	},2000);


	$scope.markerclick=function(marker)
	{
		$scope.mainasset=marker;
		console.log(marker);
		$scope.selected=true;
	}

	
	$scope.get_displayprice=function(dis,price)
	{
		var d=parseInt(dis);
		var p=parseInt(price);
		var out=(p/100)*(100-d);
		return out;
	}

	$scope.get_discount=function(dis,price)
	{
		var d=parseInt(dis);
		var p=parseInt(price);
		var out=(p/100)*(d);
		return out;
	}


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
	$scope.showslider=false;

	$scope.show_slideshow=function(){
		angular.forEach($scope.mainasset.slideshow,function(slide){
			slide.imgactive=0;
		});
		$scope.sliderimg=$scope.mainasset.slideshow[0].imagepath;
		$scope.mainasset.slideshow[0].imgactive=1;
		$scope.showslider=true;
	}

	$scope.close_slider=function(){
		$scope.showslider=false;
	}

	$scope.imgactive=function(slide)
	{
		if(slide.imgactive==1)
		{
			return 'imgactive';
		}
	}

	$scope.change_slider=function(slide)
	{
		if(slide.imgactive==0)
		{
			angular.forEach($scope.mainasset.slideshow,function(slider){
				slider.imgactive=0;
			});
			slide.imgactive=1;
			$scope.sliderimg=slide.imagepath;
		}
	}

	$scope.move_left=function(slide)
	{
		for(var i=0;i<$scope.mainasset.slideshow.length;i++)
		{
			if($scope.mainasset.slideshow[i].imgactive==1)
			{
				$scope.mainasset.slideshow[i].imgactive=0;
				$scope.mainasset.slideshow[i-1].imgactive=1;
				$scope.sliderimg=$scope.mainasset.slideshow[i-1].imagepath;
				break;
			}
		}
	}

	$scope.move_right=function(slide)
	{
		for(var i=0;i<$scope.mainasset.slideshow.length;i++)
		{
			if($scope.mainasset.slideshow[i].imgactive==1)
			{
				$scope.mainasset.slideshow[i].imgactive=0;
				$scope.mainasset.slideshow[i+1].imgactive=1;
				$scope.sliderimg=$scope.mainasset.slideshow[i+1].imagepath;
				break;
			}
		}
	}

	$scope.show_left=function(){
		if($scope.mainasset.slideshow[0].imgactive==1)
		{
			return false;
		}
		else
		{
			return true;
		}
	}

	$scope.show_right=function(){
		var counter=0;
		var out=true;
		angular.forEach($scope.mainasset.slideshow,function(slider){
			if(slider.imgactive==1)
			{
				if(counter==$scope.mainasset.slideshow.length-1)
				{
					out=false;
				}
			}
			counter++;
		});
		return out;
	}

	$scope.gotocamplist = function() {

		$state.go('campaignlist');
	}

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
		$state.go('main',{'city':$scope.city,'type':$scope.mtype,'locality':$scope.mlocality,'fromdate':$scope.fdate,'tilldate':$scope.tdate});
	}

	$scope.$watch('fromdate',function(){
		if($scope.fromdate)
		{
			if($scope.fromdate==$stateParams.fromdate)
			{
				
			}
			else
			{
				$state.go('main',{'city':$scope.city,'type':$scope.mtype,'locality':'All','fromdate':$scope.fromdate,'tilldate':$scope.tdate});
			}
		}
	});

	$scope.$watch('tilldate',function(){
		if($scope.tilldate)
		{
			if($scope.tilldate==$stateParams.tilldate)
			{
				
			}
			else
			{
				$state.go('main',{'city':$scope.city,'type':$scope.mtype,'locality':'All','fromdate':$scope.fdate,'tilldate':$scope.tilldate});
			}
		}
	});

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
					$scope.mapcenter={latitude:parseFloat(city.latitude),longitude:parseFloat(city.longitude)};
					$scope.mapzoom = 13;
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
					if($scope.mainlocality.length==1)
					{
						if($scope.mainlocality[0]==locality.name)
						{
							$scope.mapcenter={latitude:parseFloat(locality.latitude),longitude:parseFloat(locality.longitude)};
							$scope.pos={latitude:parseFloat(locality.latitude),longitude:parseFloat(locality.longitude)};
							$scope.visible=true;
							$scope.mapzoom=15;
						}
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
				$scope.mapcenter={latitude:parseFloat(city.latitude),longitude:parseFloat(city.longitude)};
				$scope.mapzoom = 13;
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
				if($scope.mainlocality.length==1)
				{
					if($scope.mainlocality[0]==locality.name)
					{
						$scope.mapcenter={latitude:parseFloat(locality.latitude),longitude:parseFloat(locality.longitude)};
						$scope.pos={latitude:parseFloat(locality.latitude),longitude:parseFloat(locality.longitude)};
						$scope.visible=true;
						$scope.mapzoom=15;
					}
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
			$state.go('main',{'city':$scope.city,'type':$scope.mtype,'locality':'All','fromdate':$scope.fdate,'tilldate':$scope.tdate});
		}
		else
		{
			$state.go('main',{'city':$scope.city,'type':$scope.mtype,'locality':'None','fromdate':$scope.fdate,'tilldate':$scope.tdate});
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
		$state.go('main',{'city':$scope.city,'type':$scope.mtype,'locality':$scope.mlocality,'fromdate':$scope.fdate,'tilldate':$scope.tdate});
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

	//booking part start

	$scope.bookthisadspace = function() {

		if(localStorage.token) {

			$scope.$parent.popupwrapper = true;
			$scope.$parent.bookthisad = true;
			$scope.$parent.mainasset = $scope.mainasset;	
			
		} else {
			$scope.$parent.popupwrapper = true;
	    	$scope.$parent.popupsignin = true;
	    	$scope.$parent.bookclickcheck = true;
		}
	}
	$scope.bookingerror = false;
	$scope.$watch('fromdatebook',function(){
		if($scope.fromdatebook)
		{

			$scope.bookingerror = false;
			$scope.bookingerrorfrom = false;

			var frombookingexp = $scope.fromdatebook.split("-");
			var frombooking = frombookingexp[2]+"-"+frombookingexp[1]+"-"+frombookingexp[0];

			var freecount = 0;
			angular.forEach($scope.mainasset.freebook, function(eachfreeout){

				angular.forEach(eachfreeout, function(eachfree){

					var freeexp = eachfree.split(":");
					if(frombooking >= freeexp[0] && frombooking <= freeexp[1]) {

						freecount = freecount+1;
						
					} else {

						
					}

				});
				
			});

			if(freecount == 0 && $scope.fromdatebook != "From") {

				$scope.bookingerror = true;
				$scope.bookingerrorfrom = true;
				$scope.bookingerrval = "This date is already booked for this Ad. Please select different 'From' date";
			}
			
		}
	});

	$scope.$watch('tilldatebook',function(){
		if($scope.tilldatebook)
		{

			if(!$scope.bookingerrorfrom) {

				$scope.bookingerror = false;
			}
			var lastfreedate;
			var tillbookingexp = $scope.tilldatebook.split("-");
			var tillbooking = tillbookingexp[2]+"-"+tillbookingexp[1]+"-"+tillbookingexp[0];

			var frombookingexp = $scope.fromdatebook.split("-");
			var frombooking = frombookingexp[2]+"-"+frombookingexp[1]+"-"+frombookingexp[0];

			var freecount = 0;
			angular.forEach($scope.mainasset.freebook, function(eachfreeout){

				angular.forEach(eachfreeout, function(eachfree){

					var freeexp = eachfree.split(":");
					if(tillbooking >= freeexp[0] && tillbooking <= freeexp[1]) {

						freecount = freecount+1;
						
					} else {

						
					}

					if(frombooking >= freeexp[0] && frombooking <= freeexp[1]) {

						lastfreedate = freeexp[1];
					}

				});
				
			});

			if(freecount == 0 && $scope.tilldatebook != "To") {

				$scope.bookingerror = true;
				$scope.bookingerrval = "This date is already booked for this Ad. Please select different 'From' date";
			} 
			var diffd = daysBetween(frombooking, tillbooking);
			if(tillbooking > lastfreedate && $scope.tilldatebook != "To" && $scope.fromdatebook != "From") {

				$scope.bookingerror = true;
				$scope.bookingerrval = "This selected slot is not free";
			} else if(diffd < 30 && $scope.tilldatebook != "To" && $scope.fromdatebook != "From") {

				$scope.bookingerror = true;
				$scope.bookingerrval = "You must book this Ad for atleast 30 days";
			} else if(tillbooking > $scope.maxdate && $scope.tilldatebook != "To" && $scope.fromdatebook != "From") {

				$scope.bookingerror = true;
				$scope.bookingerrval = "Sorry! This Ad is available till "+$scope.maxdate+" only";
			}

			
		}
	});

	$scope.booknow = function(thisasset) {

		$scope.bookingerror = false;

		if(localStorage.token && !$scope.bookingerror && $scope.tilldatebook != "To" && $scope.fromdatebook != "From") {

			var tillbookingexp = $scope.tilldatebook.split("-");
			var tillbooking = tillbookingexp[2]+"-"+tillbookingexp[1]+"-"+tillbookingexp[0];

			var frombookingexp = $scope.fromdatebook.split("-");
			var frombooking = frombookingexp[2]+"-"+frombookingexp[1]+"-"+frombookingexp[0];

			var ourprice = $scope.get_displayprice(thisasset.discount_percent,thisasset.orginal_price);
			var advance = $scope.get_discount(thisasset.advance_percent,thisasset.orginal_price);
			var diffd = daysBetween(frombooking, tillbooking);

			if(diffd >= 30) {
				$http({
					method:'POST',
					url:$scope.requesturl+'book_ad',
					data:{assetid:thisasset.id, ourprice:ourprice, advance:advance, userid:$scope.user.id, bookstart:frombooking, bookend:tillbooking}
				}).
				success(function(result){ 
					console.log(result);
					if(result>0) {

						window.location.href = "partials/bookingpreview.php?id="+result;
					}
					
				});
			} else {

				$scope.bookingerror = true;
				$scope.bookingerrval = "You must book this Ad for atleast 30 days";
			}

		} else {

				$scope.bookingerror = true;
				$scope.bookingerrval = "Please select the free slot to proceed";
		}
	}

	//booking part end

	//campign part start

	$scope.adthistocampaignfun = function() {

		if(localStorage.token) {

			closeallpopup();

			$scope.$parent.popupwrapper = true;
			$scope.$parent.adthistocampaign = true;
			$scope.$parent.mainasset = $scope.mainasset;	
			
		} else {
			$scope.$parent.popupwrapper = true;
	    	$scope.$parent.popupsignin = true;
	    	$scope.$parent.campaignclickcheck = true;
		}
	}

	$scope.selcampchange = function() {

		if($scope.selectedcamp != "") {

			if(localStorage.token != "") {

				$scope.campaigndetail = false;
				$http({
				method:'GET',
				url:$scope.requesturl+'get_campdetails',
				params:{campid:$scope.selectedcamp}
				}).
				success(function(result){ 
					console.log(result[0]['campasset']);

					var advancetotal = 0;	
					var totalcampamount = 0;
					var clooparr = [];

					angular.forEach(result[0]['campasset'], function(eachasset){

						advancetotal = advancetotal + $scope.get_discount(eachasset.asset.advance_percent,eachasset.asset.orginal_price);

						totalcampamount = totalcampamount + $scope.get_displayprice(eachasset.asset.discount_percent,eachasset.asset.orginal_price);

						if(!clooparr[eachasset.assetid]) {

							clooparr[eachasset.assetid] = 1;
						} else {

							clooparr[eachasset.assetid] = clooparr[eachasset.assetid]+1;
						}
					});

					$scope.totalcampadvance = advancetotal;
					$scope.totalcampamount = totalcampamount;
					var bookingarr = [];

					if(result[0]['campasset'].length > 0) {

						if(result[0]['campasset'].length == 1) {

							if(!bookingarr[result[0]['campasset'][0]['assetid']]) {

								bookingarr[result[0]['campasset'][0]['assetid']] = [];
							}

							var diffd = daysBetween(result[0]['campasset'][0]['bookend'],$scope.tsdate);

							if(diffd >= 30) {
								bookingarr[result[0]['campasset'][0]['assetid']].push(result[0]['campasset'][0]['bookend']+':'+$scope.tsdate);
							}

						} else {

							var cloop = 1;
							clooparr2 = [];
							lastenddate = [];

							angular.forEach(result[0]['campasset'],function(vb){

								if(!bookingarr[vb.assetid]) {

									clooparr2[vb.assetid] = 1;

									bookingarr[vb.assetid] = [];

									if(vb.bookstart > $scope.fsdate) {

										var diffd = daysBetween(vb.bookstart, $scope.fsdate);

										if(diffd >= 30) {

											bookingarr[vb.assetid].push($scope.fsdate+':'+vb.bookstart);
										} 
									} 

									if(clooparr[vb.assetid] == clooparr2[vb.assetid]) {

										var diffd = daysBetween(vb.bookend,$scope.tsdate);

										if(diffd >= 30) {
											bookingarr[vb.assetid].push(vb.bookend+':'+$scope.tsdate);
										}

									}
								} else {

									clooparr2[vb.assetid] = clooparr2[vb.assetid] + 1;
									
									if(clooparr[vb.assetid] == clooparr2[vb.assetid]) {

										var diffd = daysBetween(lastenddate[vb.assetid],vb.bookstart);

										if(diffd >= 30) {
											bookingarr[vb.assetid].push(lastenddate[vb.assetid]+':'+vb.bookstart);
										}

										var diffd = daysBetween(vb.bookend,$scope.tsdate);

										if(diffd >= 30) {
											bookingarr[vb.assetid].push(vb.bookend+':'+$scope.tsdate);
										}
									} else {

										var diffd = daysBetween(lastenddate[vb.assetid],vb.bookstart);

										if(diffd >= 30) {
											bookingarr[vb.assetid].push(lastenddate[vb.assetid]+':'+vb.bookstart);
										}

									} 

									
								} 

								lastenddate[vb.assetid] = vb.bookend;
							});
						}

					} else {
						bookingarr[$scope.mainasset.id] = [];

						bookingarr[$scope.mainasset.id].push($scope.fsdate+':'+$scope.tsdate);
					}

					result[0]['freecampasset'] = [];
					result[0]['freecampasset'].push(bookingarr);
					$scope.campaigndetail = result[0];

					console.log($scope.campaigndetail);

					//checking if the asset in campaign is booked or not(in case of old campaign its possible that the asset added in that campaign got booked)
					$scope.bookcheck = [];
					$scope.bookcheckmain = 0;
					angular.forEach(result[0]['campasset'], function(campas){

						var frombookingc = campas.bookstart;
						var tillbookingc = campas.bookend;

						angular.forEach($scope.mainmarkers, function(eachfreeout){

							if(eachfreeout.id == campas.assetid) {

								if(!$scope.bookcheck[campas.id]) {
									$scope.bookcheck[campas.id] = [];
									$scope.bookcheck[campas.id] = 1;
								}
								angular.forEach(eachfreeout.freebook[0], function(eachfree){

									var splitfree = eachfree.split(":");
									if((campas.bookstart >= splitfree[0] && campas.bookstart <= splitfree[1]) && (campas.bookend >= splitfree[0] && campas.bookend <= splitfree[1])) {

										$scope.bookcheck[campas.id] = 0;
									}

								});
							}
							
						});
					});
					angular.forEach($scope.bookcheck, function(booksingle){

						if(booksingle == 1) {

							$scope.bookcheckmain = 1;
						}
					});


				});
			}
			
		}
	}
	$scope.$watch('fromdatecamp',function(){
		if($scope.fromdatecamp)
		{

			$scope.bookingerror = false;
			$scope.bookingerrorfrom = false;

			var frombookingexp = $scope.fromdatecamp.split("-");
			var frombooking = frombookingexp[2]+"-"+frombookingexp[1]+"-"+frombookingexp[0];
			var freecount = 0;
			angular.forEach($scope.mainasset.freebook, function(eachfreeout){

				angular.forEach(eachfreeout, function(eachfree){

					var freeexp = eachfree.split(":");
					if(frombooking >= freeexp[0] && frombooking <= freeexp[1]) {

						freecount = freecount+1;
						
					} else {

						
					}

				});
				
			});
			if(freecount == 0 && $scope.fromdatecamp != "From") {

				$scope.bookingerror = true;
				$scope.bookingerrorfrom = true;
				$scope.bookingerrval = "This date is already booked for this Ad. Please select different 'From' date";
			}

			//for booked campain assets
			if(!$scope.bookingerror && $scope.campaigndetail && $scope.campaigndetail['freecampasset'][0][$scope.mainasset.id]) {
				var freecount = 0;

				angular.forEach($scope.campaigndetail['freecampasset'], function(eachfreeout){

					angular.forEach(eachfreeout[$scope.mainasset.id], function(eachfree){



						var freeexp = eachfree.split(":");
						if(frombooking >= freeexp[0] && frombooking <= freeexp[1]) {

							freecount = freecount+1;
							
						} else {

							
						}

					});
					
				});

				if(freecount == 0 && $scope.fromdatecamp != "From") {

					$scope.bookingerror = true;
					$scope.bookingerrorfrom = true;
					$scope.bookingerrval = "This date is already booked in this campaign for this Ad. Please select different 'From' date";
				}
			}
			
		}
	});

	$scope.$watch('tilldatecamp',function(){

		if($scope.tilldatecamp && $scope.tilldatecamp > $scope.fromdatecamp && $scope.tilldatecamp != 'To')
		{
			if(!$scope.bookingerrorfrom) {

				$scope.bookingerror = false;
			}

			var lastfreedate;
			var tillbookingexp = $scope.tilldatecamp.split("-");
			var tillbooking = tillbookingexp[2]+"-"+tillbookingexp[1]+"-"+tillbookingexp[0];

			var frombookingexp = $scope.fromdatecamp.split("-");
			var frombooking = frombookingexp[2]+"-"+frombookingexp[1]+"-"+frombookingexp[0];

			var freecount = 0;
			angular.forEach($scope.mainasset.freebook, function(eachfreeout){

				angular.forEach(eachfreeout, function(eachfree){

					var freeexp = eachfree.split(":");
					if(tillbooking >= freeexp[0] && tillbooking <= freeexp[1]) {

						freecount = freecount+1;
						
					} else {

						
					}

					if(frombooking >= freeexp[0] && frombooking <= freeexp[1]) {

						lastfreedate = freeexp[1];
					}

				});
				
			});

			if(freecount == 0 && $scope.tilldatecamp != "To") {

				$scope.bookingerror = true;
				$scope.bookingerrval = "This date is already booked for this Ad. Please select different 'From' date";
			} 
			var diffd = daysBetween(frombooking, tillbooking);
			if(tillbooking > lastfreedate && $scope.tilldatecamp != "To" && $scope.fromdatecamp != "From") {

				$scope.bookingerror = true;
				$scope.bookingerrval = "This selected slot is not free";
			} else if(diffd < 30 && $scope.tilldatecamp != "To" && $scope.fromdatecamp != "From") {

				$scope.bookingerror = true;
				$scope.bookingerrval = "You must book this Ad for atleast 30 days";
			} else if(tillbooking > $scope.maxdate && $scope.tilldatecamp!= "To" && $scope.fromdatecamp != "From") {

				$scope.bookingerror = true;
				$scope.bookingerrval = "Sorry! This Ad is available till "+$scope.maxdate+" only";
			}

			//for booking campaign assets
			if(!$scope.bookingerror && $scope.campaigndetail && $scope.campaigndetail['freecampasset'][0][$scope.mainasset.id]) {

				var freecount = 0;
				angular.forEach($scope.campaigndetail['freecampasset'], function(eachfreeout){

					angular.forEach(eachfreeout[$scope.mainasset.id], function(eachfree){

						var freeexp = eachfree.split(":");
						if(tillbooking >= freeexp[0] && tillbooking <= freeexp[1]) {

							freecount = freecount+1;
							
						} else {

							
						}

						if(frombooking >= freeexp[0] && frombooking <= freeexp[1]) {

							lastfreedate = freeexp[1];
						}

					});
					
				});

				if(freecount == 0 && $scope.tilldatecamp != "To") {

					$scope.bookingerror = true;
					$scope.bookingerrval = "This date is already booked in this campaign for this Ad. Please select different 'From' date";
				} 
				var diffd = daysBetween(frombooking, tillbooking);
				if(tillbooking > lastfreedate && $scope.tilldatecamp != "To" && $scope.fromdatecamp != "From") {

					$scope.bookingerror = true;
					$scope.bookingerrval = "This selected slot is not free";
				} else if(diffd < 30 && $scope.tilldatecamp != "To" && $scope.fromdatecamp != "From") {

					$scope.bookingerror = true;
					$scope.bookingerrval = "You must book this Ad for atleast 30 days";
				} else if(tillbooking > $scope.maxdate && $scope.tilldatecamp!= "To" && $scope.fromdatecamp != "From") {

					$scope.bookingerror = true;
					$scope.bookingerrval = "Sorry! This Ad is available till "+$scope.maxdate+" only";
				}
			}

			$scope.$watch('fromdatecamp');

			
		} else {

			if($scope.fromdatecamp && $scope.tilldatecamp && $scope.tilldatecamp != 'To' && $scope.fromdatecamp != 'From') {
				$scope.bookingerror = true;
				$scope.bookingerrval = "'From' date cannot be greater than 'To' date";
			}
		}
	});

	$scope.addtoselectedcamp = function() {

		if(localStorage.token && !$scope.bookingerror && $scope.tilldatecamp != "To" && $scope.fromdatecamp != "From") {

			var tillbookingexp = $scope.tilldatecamp.split("-");
			var tillbooking = tillbookingexp[2]+"-"+tillbookingexp[1]+"-"+tillbookingexp[0];

			var frombookingexp = $scope.fromdatecamp.split("-");
			var frombooking = frombookingexp[2]+"-"+frombookingexp[1]+"-"+frombookingexp[0];

			var diffd = daysBetween(frombooking, tillbooking);

			if(diffd >= 30) {

				$http({
				method:'POST',
				url:$scope.requesturl+'insert_campasset',
				data:{assetid:$scope.mainasset.id, fromdate:frombooking, tilldate:tillbooking, campid:$scope.campaigndetail.id}
				}).
				success(function(result){ 
					console.log(result);

					$scope.selcampchange();

				});
			} else {

				$scope.bookingerror = true;
				$scope.bookingerrval = "You must book this Ad for atleast 30 days";
			}

		} else {

				$scope.bookingerror = true;
				$scope.bookingerrval = "Please select the free slot to proceed";
		}


	}

	$scope.removecampasset = function(campassetid) {

		if(window.confirm("Are you sure you want to delete the clicked asset from this campaign?")) {

			$http({
			method:'POST',
			url:$scope.requesturl+'remove_campasset',
			data:{assetid:campassetid}
			}).
			success(function(result){ 

				$scope.selcampchange();
			});
		}
	}

	function closeallpopup() {
		$scope.$parent.popupsignin = false;
		$scope.$parent.popupsignup = false;
		$scope.$parent.popupforgot = false;
		$scope.$parent.popupchangepass = false;
		$scope.$parent.bookthisad = false;
		$scope.$parent.adthistocampaign = false;
		$scope.$parent.createnewcampaign = false;
	}

	$scope.createnewcamp = function() {

		if(localStorage.token) {
			closeallpopup();
			$scope.$parent.popupwrapper = true;
			$scope.$parent.createnewcampaign = true;
			$scope.$parent.mainasset = $scope.mainasset;	
			
		} else {
			$scope.$parent.popupwrapper = true;
	    	$scope.$parent.popupsignin = true;
		}
	}


	$scope.variables_true = function(x)
	{
		if(x=='visibility')
		{
			$scope.visibilityphoto = true;
			$scope.lightbox = true;
		}
		else if(x=='visibilityclose')
		{
			$scope.visibilityphoto = false;
			$scope.lightbox = false;
		}
		else if(x=='lineofsight')
		{
			$scope.lineofsightphoto = true;
			$scope.lightbox = true;
		}
		else if(x=='lineofsightclose')
		{
			$scope.lineofsightphoto = false;
			$scope.lightbox = false;
		}
		else if(x=='timeofsight')
		{
			$scope.timeofsightphoto = true;
			$scope.lightbox = true;
		}
		else if(x=='timeofsightclose')
		{
			$scope.timeofsightphoto = false;
			$scope.lightbox = false;
		}
	}

	$scope.createthiscamp = function() {

		if(!$scope.newcampname) {

			$scope.createcamperr = true;
			$scope.createcamperror = "Please enter a campaign name";
		} else if($scope.fromdatenewcamp == "From") {

			$scope.createcamperr = true;
			$scope.createcamperror = "Please select 'From' date";
		} else if($scope.tilldatenewcamp == "To") {

			$scope.createcamperr = true;
			$scope.createcamperror = "Please select 'To' date";
		} else {

			var tillbookingexp = $scope.tilldatenewcamp.split("-");
			var tillbooking = tillbookingexp[2]+"-"+tillbookingexp[1]+"-"+tillbookingexp[0];

			var frombookingexp = $scope.fromdatenewcamp.split("-");
			var frombooking = frombookingexp[2]+"-"+frombookingexp[1]+"-"+frombookingexp[0];

			var diffd = daysBetween(frombooking, tillbooking);

			if(frombooking > tillbooking) {

				$scope.createcamperr = true;
				$scope.createcamperror = "'From' date cannot be more than 'To' date";
			} else if(diffd < 30) {

				$scope.createcamperr = true;
				$scope.createcamperror = "You must create a campaign atleast for 30 days";
			} else {

				$scope.createcamperr = false;

				$http({
				method:'POST',
				url:$scope.requesturl+'create_campaign',
				data:{campname:$scope.newcampname, frombooking:frombooking, tillbooking:tillbooking, userid:$scope.user.id}
				}).
				success(function(result){ 

					console.log($scope.user);
					$scope.loginerror = false;
					$http({
					method:'GET',
					url:$scope.requesturl+'get_user',
					headers:{'X-CSRFToken':localStorage.token}
					}).
					success(function(result){ 
						if(result[0]) {
						$scope.user = result[0];
						$scope.adthistocampaignfun();
						} else {

							$scope.user = {};
							$state.go("search");
						}
					});
					
				});

			}
		}
	}

	$scope.bookcampfinal = function(campid) {


		if($scope.bookcheckmain == 1) {

			$scope.campbookerr = true;
			$scope.campbookerrval = "Please delete all the booked assets(with red background color) from campaign";
		} else {

			$scope.campbookerr = false;
			if(window.confirm("Are you sure you want to book this campaign?")) {
				window.location.href="partials/bookcamppreview.php?campid="+campid;
			}
		}
	}

	$scope.viewcamp = function(campid) {

		$scope.$parent.closepopup();

		$state.go('maincampaign',{'campid':campid,'city':'None', 'locality':'None','type':'None','check':'None','fromdate':'From','tilldate':'To'});
	}

	//campaign part end

	//Map data
	//$scope.mrk = "http://localhost/monk/outdoormonk/front/images/marker.png";
	$scope.markers = $scope.myMarkers;
	$scope.mapfit = true;
	$scope.mapoptions = {
		styles : [
			{
				featureType : "landscape",
				elementType : "geometry",
				stylers : [
					{ color : "#e6e6e6" },
					{ saturation : -40 }
				]
			},{
				featureType : "water",
				elementType : "geometry",
				stylers : [
					{ color : "#92a2ae" },
					{ lightness : 20 },
					{ visibility : "simplified" }
				]
			},{
				featureType : "poi",
				elementType : "geometry",
				stylers : [
					{ color : "#e2e2e2" },
					{ lightness : 0 },
					{ visibility : "simplified" }
				]	
			},{
				featureType : "transit.station",
				elementType : "labels.icon",
				stylers : [
					{ hue : "#bababa"},
					{ saturation : -100 },
					{ lightness : 0 },
					{ visibility : "simplified" }
				]
			},{
				featureType : "road.highway",
				elementType : "geometry",
				stylers : [
					{ color : "#8a8a8a" },
					{ lightness : 0 },
					{ visibility : "simplified" }
				]
			},{
				featureType : "road.arterial",
				elementType : "geometry",
				stylers : [
					{ color : "#adadad" },
					{ lightness: 0 },
					{ visibility: "simplified" }
				]
			},{
				featureType : "road.local",
				elementType : "geometry",
				stylers : [
					{ color : "#ffffff" },
					{ lightness : 0 },
					{ visibility : "simplified" }
				]
			},{
				featureType : "road.highway",
				elementType : "labels",
				stylers : [
					{ saturation : -80 },
					{ lightness : 80 },
					{ visibility : "simplified" }
				]
			},{
				featureType : "road.arterial",
				elementType : "labels",
				stylers : [
					{color : "#ffffff" },
					{ lightness : 0 },
					{ visibility : "simplified" }
				]
			}
		]
	};

});

app.controller("CampaignListController",function($scope,$http,$stateParams,$state,TypesData,CityData,LocalityData,$rootScope, Dates, Logging){

	if(localStorage.token == "")
	{
		$state.go("search");
		
	}

	$scope.get_displayprice=function(dis,price)
	{
		var d=parseInt(dis);
		var p=parseInt(price);
		var out=(p/100)*(100-d);
		return out;
	}

	$scope.get_discount=function(dis,price)
	{
		var d=parseInt(dis);
		var p=parseInt(price);
		var out=(p/100)*(d);
		return out;
	}

	setTimeout(function() {

		$scope.totalcampdetails = [];

		var costarr = [];

		if($state.current.name == "campaignlist") {

			$http({
				method:'GET',
				url:$scope.requesturl+'get_allcampdetails',
				params:{userid:$scope.user.id}
			}). 
			success(function(result){

				angular.forEach(result,function(r){

					r.campamount = 0;
					r.campadvance = 0;
					
					angular.forEach(r.campasset,function(rin){

						r.campamount = r.campamount + $scope.get_displayprice(rin.asset.discount_percent,rin.asset.orginal_price);
						r.campadvance = r.campadvance + $scope.get_discount(rin.asset.advance_percent,rin.asset.orginal_price);

					});

					costarr.push(r);

				});

				$scope.totalcampdetails = costarr;
				
			});

		}
	},500);

});

app.controller("CampaignController",function($scope,$http,$stateParams,$state,TypesData,CityData,LocalityData,$rootScope, Dates, Logging){

	$scope.selected=false;
	$scope.pos={latitude:17.424986, longitude:78.475428};
	$scope.mapcenter = {latitude:17.424986, longitude:78.475428};
	$scope.locationflag=false;
	$scope.locality="Select Locality";
	$scope.localityflag=false;
	$scope.mapzoom = 13;
	$scope.mapfill={color:'#000000',opacity:'0.3'};
	$scope.mapstroke={color:'#000000',opacity:'0.4',weight: 1};
	$scope.visible = false;
	$scope.maprad=1000;
	$scope.thiscampid = $stateParams.campid;
	$scope.editnameactive = false;
	if($stateParams.city=='' || $stateParams.city=='None')
	{
		$scope.city='Hyderabad';
	}
	else
	{
		$scope.city=$stateParams.city;
	}

	if($stateParams.fromdate=='')
	{
		$scope.fdate='From';
	}
	else
	{
		$scope.fdate=$stateParams.fromdate;
	}
	if($stateParams.tilldate=='')
	{
		$scope.tdate='To';
	}
	else
	{
		$scope.tdate=$stateParams.tilldate;
	}

	if(localStorage.token == "")
	{
		if($state.current.name != "maincampaignshare") {
			$state.go("search");
		}
		
	}
	setTimeout(function(){

		if($state.current.name != "campaignlist") {

			var inc = 0;

			angular.forEach($scope.$parent.user.bookedcamp,function(m){

			 	if($stateParams.campid == m.id){

			 		inc = inc+1;
			 		if(m.book_flag == 1) {

			 			$state.go('maincampaignshare',{'campid':$stateParams.campid, 'city':'None','type':'None','locality':'None'});
			 		}
			 	}

			});
			if(inc == 0){

			 	$state.go("search");
			} 
		}
	},1000);

	
	
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
		$scope.all_localitiesloc=true;
	}
	else
	{
		$scope.mainlocality=JSON.parse($stateParams.locality);
		$scope.all_localities=false;
		$scope.all_localitiesloc=false;
		if($scope.mainlocality.length==1)
		{
			$scope.locality=$scope.mainlocality[0];
		}
		else
		{
			$scope.locality='Custom';
		}
	}

	$scope.logoutclick = function() {
		$scope.user = Logging.logout();
		$state.go("search");
	}
	$scope.$watch('fromdate',function(){
		if($scope.fromdate)
		{
			if($scope.fromdate==$stateParams.fromdate)
			{
				
			}
			else
			{
				$state.go('maincampaign',{'campid':$scope.thiscampid, 'city':$scope.city,'type':$scope.mtype,'locality':'All', 'check':'All','fromdate':$scope.fromdate,'tilldate':$scope.tdate});
			}
		}
	});

	$scope.$watch('tilldate',function(){
		if($scope.tilldate)
		{
			if($scope.tilldate==$stateParams.tilldate)
			{
				
			}
			else
			{
				$state.go('maincampaign',{'campid':$scope.thiscampid, 'city':$scope.city,'type':$scope.mtype,'locality':'All', 'check':'All','fromdate':$scope.fdate,'tilldate':$scope.tilldate});
			}
		}
	});


	function daysBetween( date1, date2 ) {

		var splitdate1 = date1.split("-");
		var splitdate2 = date2.split("-");

		var dateconv1  = new Date(splitdate1[0], splitdate1[1]-1, splitdate1[2]); 
		var dateform1 = new Date(dateconv1.getFullYear(), dateconv1.getMonth(), dateconv1.getDate());

		var dateconv2  = new Date(splitdate2[0], splitdate2[1]-1, splitdate2[2]); 
		var dateform2 = new Date(dateconv2.getFullYear(), dateconv2.getMonth(), dateconv2.getDate());


	  //Get 1 day in milliseconds
	  var one_day=1000*60*60*24;

	  // Convert both dates to milliseconds
	  var date1_ms = dateconv1.getTime();
	  var date2_ms = dateconv2.getTime();

	  // Calculate the difference in milliseconds
	  var difference_ms = Math.abs(date2_ms - date1_ms);
	    
	  // Convert back to days and return
	  return Math.round(difference_ms/one_day); 
	}

	//getting all assets of current campaign
	$scope.getmarkerfunction = function() {
		setTimeout(function(){

			$scope.mainmarkers=[];
			$scope.mainmarkers2=[];
			$scope.mainlocality = [];
			$scope.tsdate = $scope.$parent.maxdate;
			$scope.fsdate = $scope.$parent.todate;
			var lastenddate = "";
			$http({
				method:'GET',
				url:$scope.requesturl+'/get_markersthis',
				params:{city:$scope.city, campid:$scope.thiscampid}
			}). 
			success(function(result){
				
				
				var nfdate=$scope.fsdate;
			
				var ntdate=$scope.tsdate;			
				
				$scope.markerdata=result;

				console.log(result);

				angular.forEach($scope.markerdata,function(m2){
					m2.asset=[];

					angular.forEach(m2.campasset,function(ca){

						if(ca.asset) {
							m2.asset.push(ca.asset);
						}
						
					});


				angular.forEach(m2.asset,function(m){

					m.icon = "images/markeryellow.png";
					var bookingth=m.booking;
					var bookingarr = [];
					var diffd = 0;

					if(m.booking.length > 0) {

						if(m.booking.length == 1) {

							var diffd = daysBetween(m.booking[0]['bookend'],$scope.tsdate);

							if(diffd >= 30) {
								bookingarr.push(m.booking[0]['bookend']+':'+$scope.tsdate);
							}

						} else {

							var cloop = 1;

							angular.forEach(m.booking,function(vb){

								if(cloop > 1){

									if(cloop == m.booking.length) {

										var diffd = daysBetween(lastenddate,vb.bookstart);

										if(diffd >= 30) {
											bookingarr.push(lastenddate+':'+vb.bookstart);
										}

										var diffd = daysBetween(vb.bookend,$scope.tsdate);

										if(diffd >= 30) {
											bookingarr.push(vb.bookend+':'+$scope.tsdate);
										}
									} else {

										var diffd = daysBetween(lastenddate,vb.bookstart);

										if(diffd >= 30) {
											bookingarr.push(lastenddate+':'+vb.bookstart);
										}

									} 

								} else {

									if(vb.bookstart > $scope.fsdate) {

										var diffd = daysBetween(vb.bookstart, $scope.fsdate);

										if(diffd >= 30) {

											bookingarr.push(vb.bookstart+':'+$scope.fsdate);
										}
									} 

								}


								cloop = cloop + 1;
								lastenddate = vb.bookend;
							});
						}



					} else {

						bookingarr.push($scope.fsdate+':'+$scope.tsdate);
					}
					m.freebook = [];
					m.freebook.push(bookingarr);

					//changing icon according to availability
					var checkgreen = 0;
					var checkred = 0;
					var checkyellow = 0;
					angular.forEach(bookingarr,function(ba){

						var basplit = ba.split(":");

						if((nfdate >= basplit[0] && nfdate <= basplit[1]) && (ntdate >= basplit[0] && ntdate <= basplit[1])){

							checkgreen = checkgreen+1;
						} else if(((nfdate > basplit[0] && nfdate > basplit[1]) || (nfdate < basplit[0] && nfdate < basplit[1])) && ((ntdate > basplit[0] && ntdate > basplit[1]) || (ntdate < basplit[0] && ntdate < basplit[1])))
						{

							checkred = checkred+1;
						}
					});
					if(checkgreen > 0) {

						m.icon = "images/markergreen.png";
					} 
					else if(checkred == bookingarr.length) {

						m.icon = "images/markerred.png";
					}

					m.coords={latitude:m.latitude,longitude:m.longitude};
					$scope.mainmarkers.push(m);

				});
			});
			$scope.totalmarkers = $scope.mainmarkers.length;
			var maintypearr = [];
			var maintype = [];
			var maintypee = [];
			var typecheckarr = [];
			$scope.maintypes=[];

			angular.forEach($scope.mainmarkers,function(mm){

				maintypee[mm.types.id] = [];
				maintypee[mm.types.id]['name'] = [];
				maintypee[mm.types.id]['count'] = [];
				maintypee[mm.types.id]['id'] = [];

				if(maintypearr.indexOf(mm.types.id) != -1) {
					maintype[mm.types.name] = maintype[mm.types.name]+1;

				} else {
					maintype[mm.types.name] = [];
					maintype[mm.types.name] = 1;

					maintypearr.push(mm.types.id);
				}
				maintypee[mm.types.id]['count']=maintype[mm.types.name];
				maintypee[mm.types.id]['name']=mm.types.name;
				maintypee[mm.types.id]['id']=mm.types.id;
				//$scope.maintypes.push(maintypee[mm.types.id]);

			});
			angular.forEach($scope.mainmarkers,function(mm){

				if(typecheckarr.indexOf(mm.types.id) == -1){

					$scope.maintypes.push(maintypee[mm.types.id]);
					typecheckarr.push(mm.types.id);
				}
			});
			//$scope.maintypes.push(maintypee);
			console.log("dds");
			console.log($scope.maintypes);

			var advancetotal = 0;	
			var totalcampamount = 0;
			var totaloriginal = 0;
			var totalinstallation = 0;

			angular.forEach($scope.mainmarkers, function(eachasset){

				advancetotal = advancetotal + $scope.get_discount(eachasset.advance_percent,eachasset.orginal_price);

				totalcampamount = totalcampamount + $scope.get_displayprice(eachasset.discount_percent,eachasset.orginal_price);

				totalinstallation = totalinstallation + eachasset.installation;

				totaloriginal = totaloriginal + eachasset.orginal_price;
			});

			$scope.totalcampadvance = advancetotal;
			$scope.totalcampamount = totalcampamount;
			$scope.totaloriginal = totaloriginal;
			$scope.totalinstallation = totalinstallation;
			console.log($scope.markerdata);

			});


		},1000);
	}


	$scope.getmarkerfunction();
	
	$scope.getmarkertotal = function() {

		$scope.mainmarkerss=[];
		$scope.mainmarkers2=[];
		$scope.tsdate = $scope.$parent.maxdate;
		$scope.fsdate = $scope.$parent.todate;
		console.log($scope.fsdate);
		var lastenddate = "";
		$http({
			method:'GET',
			url:$scope.requesturl+'/get_markers',
			params:{city:$scope.city}
		}). 
		success(function(result){
			// console.log(result);

			if($scope.fdate=='From')
			{
				var nfdate=$scope.todate;
			}
			else
			{
				var nfdate=$scope.fdate.substring(6,11)+'-'+$scope.fdate.substring(3,5)+'-'+$scope.fdate.substring(0,2);
			}
			if($scope.tdate=='To')
			{
				var ntdate=$scope.maxdate;
			}
			else
			{
				var ntdate=$scope.tdate.substring(6,11)+'-'+$scope.tdate.substring(3,5)+'-'+$scope.tdate.substring(0,2);
			}
			
			//console.log(ntdate);
			$scope.markerdataa=result;
			angular.forEach($scope.markerdataa,function(m){

				m.icon = "images/markeryellow.png";
				var bookingth=m.booking;
				var bookingarr = [];
				var diffd = 0;

				if(m.booking.length > 0) {

					if(m.booking.length == 1) {

						var diffd = daysBetween(m.booking[0]['bookend'],$scope.tsdate);

						if(diffd >= 30) {
							bookingarr.push(m.booking[0]['bookend']+':'+$scope.tsdate);
						}

					} else {

						var cloop = 1;

						angular.forEach(m.booking,function(vb){

							if(cloop > 1){

								if(cloop == m.booking.length) {

									var diffd = daysBetween(lastenddate,vb.bookstart);

									if(diffd >= 30) {
										bookingarr.push(lastenddate+':'+vb.bookstart);
									}

									var diffd = daysBetween(vb.bookend,$scope.tsdate);

									if(diffd >= 30) {
										bookingarr.push(vb.bookend+':'+$scope.tsdate);
									}
								} else {

									var diffd = daysBetween(lastenddate,vb.bookstart);

									if(diffd >= 30) {
										bookingarr.push(lastenddate+':'+vb.bookstart);
									}

								} 

							} else {

								if(vb.bookstart > $scope.fsdate) {

									var diffd = daysBetween(vb.bookstart, $scope.fsdate);

									if(diffd >= 30) {

										bookingarr.push(vb.bookstart+':'+$scope.fsdate);
									}
								} 

							}


							cloop = cloop + 1;
							lastenddate = vb.bookend;
						});
					}



				} else {

					bookingarr.push($scope.fsdate+':'+$scope.tsdate);
				}
				m.freebook = [];
				m.freebook.push(bookingarr);

				//changing icon according to availability
				var checkgreen = 0;
				var checkred = 0;
				var checkyellow = 0;

				angular.forEach(bookingarr,function(ba){

					var basplit = ba.split(":");

					if((nfdate >= basplit[0] && nfdate <= basplit[1]) && (ntdate >= basplit[0] && ntdate <= basplit[1])){

						checkgreen = checkgreen+1;
					} else if(((nfdate > basplit[0] && nfdate > basplit[1]) || (nfdate < basplit[0] && nfdate < basplit[1])) && ((ntdate > basplit[0] && ntdate > basplit[1]) || (ntdate < basplit[0] && ntdate < basplit[1])))
					{

						checkred = checkred+1;
					}
				});
				if(checkgreen > 0) {

					m.icon = "images/markergreen.png";
				} 
				else if(checkred == bookingarr.length) {

					m.icon = "images/markerred.png";
				}

				m.coords={latitude:m.latitude,longitude:m.longitude};
				if($scope.maintype.length==0)
				{
					if($scope.mainlocality.length==0)
					{
						$scope.mainmarkerss.push(m);
					}
					else
					{
						if($scope.mainlocality.indexOf(m.localities.name)>=0)
						{
							$scope.mainmarkerss.push(m);
						}
					}
				}
				else
				{
					if($scope.maintype.indexOf(m.types.name)>=0)
					{
						if($scope.mainlocality.length==0)
						{
							$scope.mainmarkerss.push(m);
						}
						else
						{
							if($scope.mainlocality.indexOf(m.localities.name)>=0)
							{
								$scope.mainmarkerss.push(m);
							}
						}
					}
				}
			});


		});

	}

	if($stateParams.check == "All") {

		setTimeout(function(){

			$scope.editactivate();
		},1000);
	}


	$scope.markerclick=function(marker)
	{
		$scope.mainasset=marker;
		console.log(marker);
		$scope.selected=true;
	}

	$scope.markerclick2=function(marker)
	{
		$scope.mainasset=marker;
		console.log(marker);
		$scope.selected2=true;
	}


	$scope.get_displayprice=function(dis,price)
	{
		var d=parseInt(dis);
		var p=parseInt(price);
		var out=(p/100)*(100-d);
		return out;
	}

	$scope.get_discount=function(dis,price)
	{
		var d=parseInt(dis);
		var p=parseInt(price);
		var out=(p/100)*(d);
		return out;
	}

	$scope.showslider=false;

	$scope.show_slideshow=function(){
		angular.forEach($scope.mainasset.slideshow,function(slide){
			slide.imgactive=0;
		});
		$scope.sliderimg=$scope.mainasset.slideshow[0].imagepath;
		$scope.mainasset.slideshow[0].imgactive=1;
		$scope.showslider=true;
	}

	$scope.close_slider=function(){
		$scope.showslider=false;
	}

	$scope.imgactive=function(slide)
	{
		if(slide.imgactive==1)
		{
			return 'imgactive';
		}
	}

	$scope.change_slider=function(slide)
	{
		if(slide.imgactive==0)
		{
			angular.forEach($scope.mainasset.slideshow,function(slider){
				slider.imgactive=0;
			});
			slide.imgactive=1;
			$scope.sliderimg=slide.imagepath;
		}
	}

	$scope.move_left=function(slide)
	{
		for(var i=0;i<$scope.mainasset.slideshow.length;i++)
		{
			if($scope.mainasset.slideshow[i].imgactive==1)
			{
				$scope.mainasset.slideshow[i].imgactive=0;
				$scope.mainasset.slideshow[i-1].imgactive=1;
				$scope.sliderimg=$scope.mainasset.slideshow[i-1].imagepath;
				break;
			}
		}
	}

	$scope.move_right=function(slide)
	{
		for(var i=0;i<$scope.mainasset.slideshow.length;i++)
		{
			if($scope.mainasset.slideshow[i].imgactive==1)
			{
				$scope.mainasset.slideshow[i].imgactive=0;
				$scope.mainasset.slideshow[i+1].imgactive=1;
				$scope.sliderimg=$scope.mainasset.slideshow[i+1].imagepath;
				break;
			}
		}
	}

	$scope.show_left=function(){
		if($scope.mainasset.slideshow[0].imgactive==1)
		{
			return false;
		}
		else
		{
			return true;
		}
	}

	$scope.show_right=function(){
		var counter=0;
		var out=true;
		angular.forEach($scope.mainasset.slideshow,function(slider){
			if(slider.imgactive==1)
			{
				if(counter==$scope.mainasset.slideshow.length-1)
				{
					out=false;
				}
			}
			counter++;
		});
		return out;
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
		$state.go('maincampaign',{'campid':$scope.thiscampid, 'city':$scope.city,'type':$scope.mtype,'locality':$scope.mlocality, 'check':'All'});
	}

	$scope.locality_changeloc=function(locality){
		if(!locality.checkloc)
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
		$state.go('maincampaign',{'campid':$scope.thiscampid, 'city':$scope.city,'type':'None','locality':$scope.mlocality, 'check':'None'});
	}


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
					$scope.mapcenter={latitude:parseFloat(city.latitude),longitude:parseFloat(city.longitude)};
					$scope.mapzoom = 13;
					$scope.localities=city.localities;
				}
			});
			$scope.loc_count=0;
			angular.forEach($scope.localities,function(locality){
				if($scope.locality=='All')
				{
					locality.check=true;
					locality.checkloc = true;
					$scope.mainlocality.push(locality.name);
				}
				else
				{
					if($scope.mainlocality.indexOf(locality.name)>=0)
					{
						locality.check=true;
						locality.checkloc = true;
						$scope.loc_count++;
					}
					else
					{
						locality.check=false;
						locality.checkloc = false;
					}
					if($scope.mainlocality.length==1)
					{
						if($scope.mainlocality[0]==locality.name)
						{
							$scope.mapcenter={latitude:parseFloat(locality.latitude),longitude:parseFloat(locality.longitude)};
							$scope.pos={latitude:parseFloat(locality.latitude),longitude:parseFloat(locality.longitude)};
							$scope.visible=true;
							$scope.mapzoom=15;
						}
					}
				}
			});
			if($scope.loc_count==$scope.localities.length)
			{
				$scope.locality='All';
				$scope.all_localities=true;
				$scope.all_localitiesloc=true;
			}
		});
	}
	else
	{
		$scope.cities=CityData.cities;
		angular.forEach($scope.cities,function(city){
			if(city.name==$scope.city)
			{
				$scope.mapcenter={latitude:parseFloat(city.latitude),longitude:parseFloat(city.longitude)};
				$scope.mapzoom = 13;
				$scope.localities=city.localities;
			}
		});
		$scope.loc_count=0;
		angular.forEach($scope.localities,function(locality){
			if($scope.locality=='All')
			{
				locality.check=true;
				locality.checkloc = true;
				$scope.mainlocality.push(locality.name);
			}
			else
			{
				if($scope.mainlocality.indexOf(locality.name)>=0)
				{
					locality.check=true;
					locality.checkloc = true;
					$scope.loc_count++;
				}
				else
				{
					locality.check=false;
					locality.checkloc = false;
				}
				if($scope.mainlocality.length==1)
				{
					if($scope.mainlocality[0]==locality.name)
					{
						$scope.mapcenter={latitude:parseFloat(locality.latitude),longitude:parseFloat(locality.longitude)};
						$scope.pos={latitude:parseFloat(locality.latitude),longitude:parseFloat(locality.longitude)};
						$scope.visible=true;
						$scope.mapzoom=15;
					}
				}
			}
		});
		if($scope.loc_count==$scope.localities.length)
		{
			$scope.locality='All';
			$scope.all_localities=true;
			$scope.all_localitiesloc=true;
		}
	}


	$scope.select_all=function()
	{
		if($scope.all_localities)
		{
			$state.go('maincampaign',{'campid':$scope.thiscampid, 'city':$scope.city,'type':$scope.mtype,'locality':'All','check':'All'});
		}
		else
		{
			$state.go('maincampaign',{'campid':$scope.thiscampid, 'city':$scope.city,'type':$scope.mtype,'locality':'None','check':'All'});
		}
	}

	$scope.select_allloc=function()
	{
		if($scope.all_localitiesloc)
		{
			$state.go('maincampaign',{'campid':$scope.thiscampid, 'city':$scope.city,'type':'None','locality':'All','check':'None'});
		}
		else
		{
			$state.go('maincampaign',{'campid':$scope.thiscampid, 'city':$scope.city,'type':'None','locality':'None','check':'None'});
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
		$state.go('maincampaign',{'campid':$scope.thiscampid, 'city':$scope.city,'type':$scope.mtype,'locality':$scope.mlocality,'check':'All'});
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

	$scope.selectasset = function(typeid,name,count) {

		$scope.selectedasset = typeid;
		$scope.selectedassetname = name;
		$scope.selectedassetcount = count;

	}

	$scope.removecampasset = function(campassetid) {

		if(window.confirm("Are you sure you want to delete the clicked asset from this campaign?")) {

			$http({
			method:'POST',
			url:$scope.requesturl+'remove_campasset',
			data:{assetid:campassetid}
			}).
			success(function(result){ 

				selcampchange();
				$scope.getmarkerfunction();
			});
		}
	}


	$scope.addtoselectedcamp = function() {

		if(localStorage.token && !$scope.bookingerror && $scope.tilldatecamp != "To" && $scope.fromdatecamp != "From") {

			var tillbookingexp = $scope.tilldatecamp.split("-");
			var tillbooking = tillbookingexp[2]+"-"+tillbookingexp[1]+"-"+tillbookingexp[0];

			var frombookingexp = $scope.fromdatecamp.split("-");
			var frombooking = frombookingexp[2]+"-"+frombookingexp[1]+"-"+frombookingexp[0];

			var diffd = daysBetween(frombooking, tillbooking);

			if(diffd >= 30) {

				$http({
				method:'POST',
				url:$scope.requesturl+'insert_campasset',
				data:{assetid:$scope.mainasset.id, fromdate:frombooking, tilldate:tillbooking, campid:$scope.campaigndetail.id}
				}).
				success(function(result){ 

					$scope.getmarkerfunction();
					selcampchange();
					

				});
			} else {

				$scope.bookingerror = true;
				$scope.bookingerrval = "You must book this Ad for atleast 30 days";
			}

		} else {

				$scope.bookingerror = true;
				$scope.bookingerrval = "Please select the free slot to proceed";
		}


	}



	$scope.selectallasset = function() {

		$scope.selectedasset = false;
	}

	$scope.editcampname = function() {

		$http({

			method: 'POST',
			url:$scope.requesturl+'/editcampname',
			data:{campnewname:$scope.markerdata[0].campaignname, campid:$scope.thiscampid}

		}).
		success(function(result){

		});

		$scope.editnameactive=false;
	}

	$scope.editactivate = function() {

		$scope.editcampaign = true;
		$scope.getmarkertotal();
	}
	$scope.generateurl = function() {

		$scope.editcampurl="http://localhost/outdoormonk/front/#/campaignshare/"+$stateParams.campid+"/None/None/None";
	}

	$scope.bookcampfinal = function(campid) {


		if($scope.bookcheckmain == 1) {

			$scope.campbookerr = true;
			$scope.campbookerrval = "Please delete all the booked assets(with red background color) from campaign";
		} else {

			$scope.campbookerr = false;
			if(window.confirm("Are you sure you want to book this campaign?")) {
				window.location.href="partials/bookcamppreview.php?campid="+campid;
			}
		}
	}

	$scope.doubleup = true;
	$scope.doubledown = false;

	$scope.topmenuslide = function() {

		$(".campaign_details").slideToggle('slow');

		if($scope.doubleup) {

			$scope.doubleup = false;
			$scope.doubledown = true;
		}else {

			$scope.doubleup = true;
			$scope.doubledown = false;
		}
	}

	$scope.delcampasset = function(campassetid) {

		if(window.confirm("Are you sure you want to delete this asset from this campaign?")) {

			$http({
			method:'POST',
			data:{campassetid:campassetid},
			url:$scope.requesturl+'delcampasset'
			}).
			success(function(result){

				$scope.getmarkerfunction();
			});
				

		}
	}

	function closeallpopup() {
		$scope.popupsignin = false;
		$scope.popupsignup = false;
		$scope.popupforgot = false;
		$scope.popupchangepass = false;
		$scope.bookthisad = false;
		$scope.adthistocampaign = false;
		$scope.createnewcampaign = false;
	}

	$scope.$watch('fromdatecamp',function(){
		if($scope.fromdatecamp)
		{

			$scope.bookingerror = false;
			$scope.bookingerrorfrom = false;

			var frombookingexp = $scope.fromdatecamp.split("-");
			var frombooking = frombookingexp[2]+"-"+frombookingexp[1]+"-"+frombookingexp[0];
			var freecount = 0;
			angular.forEach($scope.mainasset.freebook, function(eachfreeout){

				angular.forEach(eachfreeout, function(eachfree){

					var freeexp = eachfree.split(":");
					if(frombooking >= freeexp[0] && frombooking <= freeexp[1]) {

						freecount = freecount+1;
						
					} else {

						
					}

				});
				
			});
			if(freecount == 0 && $scope.fromdatecamp != "From") {

				$scope.bookingerror = true;
				$scope.bookingerrorfrom = true;
				$scope.bookingerrval = "This date is already booked for this Ad. Please select different 'From' date";
			}

			//for booked campain assets
			if(!$scope.bookingerror && $scope.campaigndetail && $scope.campaigndetail['freecampasset'][0][$scope.mainasset.id]) {
				var freecount = 0;

				angular.forEach($scope.campaigndetail['freecampasset'], function(eachfreeout){

					angular.forEach(eachfreeout[$scope.mainasset.id], function(eachfree){



						var freeexp = eachfree.split(":");
						if(frombooking >= freeexp[0] && frombooking <= freeexp[1]) {

							freecount = freecount+1;
							
						} else {

							
						}

					});
					
				});

				if(freecount == 0 && $scope.fromdatecamp != "From") {

					$scope.bookingerror = true;
					$scope.bookingerrorfrom = true;
					$scope.bookingerrval = "This date is already booked in this campaign for this Ad. Please select different 'From' date";
				}
			}
			
		}
	});

	$scope.$watch('tilldatecamp',function(){



		if($scope.tilldatecamp && $scope.tilldatecamp > $scope.fromdatecamp && $scope.tilldatecamp != 'To')
		{

			if(!$scope.bookingerrorfrom) {

				$scope.bookingerror = false;
			}

			var lastfreedate;
			var tillbookingexp = $scope.tilldatecamp.split("-");
			var tillbooking = tillbookingexp[2]+"-"+tillbookingexp[1]+"-"+tillbookingexp[0];

			var frombookingexp = $scope.fromdatecamp.split("-");
			var frombooking = frombookingexp[2]+"-"+frombookingexp[1]+"-"+frombookingexp[0];

			var freecount = 0;
			angular.forEach($scope.mainasset.freebook, function(eachfreeout){

				angular.forEach(eachfreeout, function(eachfree){

					var freeexp = eachfree.split(":");
					if(tillbooking >= freeexp[0] && tillbooking <= freeexp[1]) {

						freecount = freecount+1;
						
					} else {

						
					}

					if(frombooking >= freeexp[0] && frombooking <= freeexp[1]) {

						lastfreedate = freeexp[1];
					}

				});
				
			});

			if(freecount == 0 && $scope.tilldatecamp != "To") {

				$scope.bookingerror = true;
				$scope.bookingerrval = "This date is already booked for this Ad. Please select different 'From' date";
			} 
			var diffd = daysBetween(frombooking, tillbooking);
			if(tillbooking > lastfreedate && $scope.tilldatecamp != "To" && $scope.fromdatecamp != "From") {

				$scope.bookingerror = true;
				$scope.bookingerrval = "This selected slot is not free";
			} else if(diffd < 30 && $scope.tilldatecamp != "To" && $scope.fromdatecamp != "From") {

				$scope.bookingerror = true;
				$scope.bookingerrval = "You must book this Ad for atleast 30 days";
			} else if(tillbooking > $scope.maxdate && $scope.tilldatecamp!= "To" && $scope.fromdatecamp != "From") {

				$scope.bookingerror = true;
				$scope.bookingerrval = "Sorry! This Ad is available till "+$scope.maxdate+" only";
			}

			//for booking campaign assets
			if(!$scope.bookingerror && $scope.campaigndetail && $scope.campaigndetail['freecampasset'][0][$scope.mainasset.id]) {

				var freecount = 0;
				angular.forEach($scope.campaigndetail['freecampasset'], function(eachfreeout){

					angular.forEach(eachfreeout[$scope.mainasset.id], function(eachfree){

						var freeexp = eachfree.split(":");
						if(tillbooking >= freeexp[0] && tillbooking <= freeexp[1]) {

							freecount = freecount+1;
							
						} else {

							
						}

						if(frombooking >= freeexp[0] && frombooking <= freeexp[1]) {

							lastfreedate = freeexp[1];
						}

					});
					
				});

				if(freecount == 0 && $scope.tilldatecamp != "To") {

					$scope.bookingerror = true;
					$scope.bookingerrval = "This date is already booked in this campaign for this Ad. Please select different 'From' date";
				} 
				var diffd = daysBetween(frombooking, tillbooking);
				if(tillbooking > lastfreedate && $scope.tilldatecamp != "To" && $scope.fromdatecamp != "From") {

					$scope.bookingerror = true;
					$scope.bookingerrval = "This selected slot is not free";
				} else if(diffd < 30 && $scope.tilldatecamp != "To" && $scope.fromdatecamp != "From") {

					$scope.bookingerror = true;
					$scope.bookingerrval = "You must book this Ad for atleast 30 days";
				} else if(tillbooking > $scope.maxdate && $scope.tilldatecamp!= "To" && $scope.fromdatecamp != "From") {

					$scope.bookingerror = true;
					$scope.bookingerrval = "Sorry! This Ad is available till "+$scope.maxdate+" only";
				}
			}

			$scope.$watch('fromdatecamp');

			
		} else {

			if($scope.fromdatecamp && $scope.tilldatecamp && $scope.tilldatecamp != 'To' && $scope.fromdatecamp != 'From') {
				$scope.bookingerror = true;
				$scope.bookingerrval = "'To' date cannot be greater than 'From' date";
			}
		}
	});

	$scope.closepopup = function() {
		$scope.popupwrapper = false;
		$scope.popupsignin = false;
		$scope.popupsignup = false;
		$scope.popupforgot = false;
		$scope.popupchangepass = false;
		$scope.bookthisad = false;
		$scope.adthistocampaign = false;
		$scope.createnewcampaign = false;
	}


	function selcampchange() {

		if($scope.thiscampid != "") {

			if(localStorage.token != "") {

				$scope.campaigndetail = false;
				$http({
				method:'GET',
				url:$scope.requesturl+'get_campdetails',
				params:{campid:$scope.thiscampid}
				}).
				success(function(result){ 
					console.log(result[0]['campasset']);

					var advancetotal = 0;	
					var totalcampamount = 0;
					var clooparr = [];

					angular.forEach(result[0]['campasset'], function(eachasset){

						advancetotal = advancetotal + $scope.get_discount(eachasset.asset.advance_percent,eachasset.asset.orginal_price);

						totalcampamount = totalcampamount + $scope.get_displayprice(eachasset.asset.discount_percent,eachasset.asset.orginal_price);

						if(!clooparr[eachasset.assetid]) {

							clooparr[eachasset.assetid] = 1;
						} else {

							clooparr[eachasset.assetid] = clooparr[eachasset.assetid]+1;
						}
					});

					$scope.totalcampadvance = advancetotal;
					$scope.totalcampamount = totalcampamount;
					var bookingarr = [];

					if(result[0]['campasset'].length > 0) {

						if(result[0]['campasset'].length == 1) {

							if(!bookingarr[result[0]['campasset'][0]['assetid']]) {

								bookingarr[result[0]['campasset'][0]['assetid']] = [];
							}

							var diffd = daysBetween(result[0]['campasset'][0]['bookend'],$scope.tsdate);

							if(diffd >= 30) {
								bookingarr[result[0]['campasset'][0]['assetid']].push(result[0]['campasset'][0]['bookend']+':'+$scope.tsdate);
							}

						} else {

							var cloop = 1;
							clooparr2 = [];
							lastenddate = [];

							angular.forEach(result[0]['campasset'],function(vb){

								if(!bookingarr[vb.assetid]) {

									clooparr2[vb.assetid] = 1;

									bookingarr[vb.assetid] = [];

									if(vb.bookstart > $scope.fsdate) {

										var diffd = daysBetween(vb.bookstart, $scope.fsdate);

										if(diffd >= 30) {

											bookingarr[vb.assetid].push($scope.fsdate+':'+vb.bookstart);
										} 
									} 

									if(clooparr[vb.assetid] == clooparr2[vb.assetid]) {

										var diffd = daysBetween(vb.bookend,$scope.tsdate);

										if(diffd >= 30) {
											bookingarr[vb.assetid].push(vb.bookend+':'+$scope.tsdate);
										}

									}
								} else {

									clooparr2[vb.assetid] = clooparr2[vb.assetid] + 1;
									
									if(clooparr[vb.assetid] == clooparr2[vb.assetid]) {

										var diffd = daysBetween(lastenddate[vb.assetid],vb.bookstart);

										if(diffd >= 30) {
											bookingarr[vb.assetid].push(lastenddate[vb.assetid]+':'+vb.bookstart);
										}

										var diffd = daysBetween(vb.bookend,$scope.tsdate);

										if(diffd >= 30) {
											bookingarr[vb.assetid].push(vb.bookend+':'+$scope.tsdate);
										}
									} else {

										var diffd = daysBetween(lastenddate[vb.assetid],vb.bookstart);

										if(diffd >= 30) {
											bookingarr[vb.assetid].push(lastenddate[vb.assetid]+':'+vb.bookstart);
										}

									} 

									
								} 

								lastenddate[vb.assetid] = vb.bookend;
							});
						}

					} else {
						bookingarr[$scope.mainasset.id] = [];

						bookingarr[$scope.mainasset.id].push($scope.fsdate+':'+$scope.tsdate);
					}

					result[0]['freecampasset'] = [];
					result[0]['freecampasset'].push(bookingarr);
					$scope.campaigndetail = result[0];

					console.log($scope.campaigndetail);

					//checking if the asset in campaign is booked or not(in case of old campaign its possible that the asset added in that campaign got booked)
					$scope.bookcheck = [];
					$scope.bookcheckmain = 0;
					angular.forEach(result[0]['campasset'], function(campas){

						var frombookingc = campas.bookstart;
						var tillbookingc = campas.bookend;

						angular.forEach($scope.mainmarkers, function(eachfreeout){

							if(eachfreeout.id == campas.assetid) {

								if(!$scope.bookcheck[campas.id]) {
									$scope.bookcheck[campas.id] = [];
									$scope.bookcheck[campas.id] = 1;
								}
								angular.forEach(eachfreeout.freebook[0], function(eachfree){

									var splitfree = eachfree.split(":");
									if((campas.bookstart >= splitfree[0] && campas.bookstart <= splitfree[1]) && (campas.bookend >= splitfree[0] && campas.bookend <= splitfree[1])) {

										$scope.bookcheck[campas.id] = 0;
									}

								});
							}
							
						});
					});
					angular.forEach($scope.bookcheck, function(booksingle){

						if(booksingle == 1) {

							$scope.bookcheckmain = 1;
						}
					});


				});
			}
			
		}
	}

	
	$scope.addthisadtocamp = function() {

		if(localStorage.token) {

			closeallpopup();

			$scope.popupwrapper = true;
			$scope.adthistocampaign = true;
			$scope.camphomeaddclick=true;
			selcampchange();

		} else {
			$scope.popupwrapper = true;
	    	$scope.popupsignin = true;
	    	$scope.campaignclickcheck = true;
		}
	}

	$scope.gotocamplist = function() {

		$state.go('campaignlist');
	}

	$scope.markers = $scope.myMarkers;
	$scope.mapfit = true;
	$scope.mapoptions = {
		styles : [
			{
				featureType : "landscape",
				elementType : "geometry",
				stylers : [
					{ color : "#e6e6e6" },
					{ saturation : -40 }
				]
			},{
				featureType : "water",
				elementType : "geometry",
				stylers : [
					{ color : "#92a2ae" },
					{ lightness : 20 },
					{ visibility : "simplified" }
				]
			},{
				featureType : "poi",
				elementType : "geometry",
				stylers : [
					{ color : "#e2e2e2" },
					{ lightness : 0 },
					{ visibility : "simplified" }
				]	
			},{
				featureType : "transit.station",
				elementType : "labels.icon",
				stylers : [
					{ hue : "#bababa"},
					{ saturation : -100 },
					{ lightness : 0 },
					{ visibility : "simplified" }
				]
			},{
				featureType : "road.highway",
				elementType : "geometry",
				stylers : [
					{ color : "#8a8a8a" },
					{ lightness : 0 },
					{ visibility : "simplified" }
				]
			},{
				featureType : "road.arterial",
				elementType : "geometry",
				stylers : [
					{ color : "#adadad" },
					{ lightness: 0 },
					{ visibility: "simplified" }
				]
			},{
				featureType : "road.local",
				elementType : "geometry",
				stylers : [
					{ color : "#ffffff" },
					{ lightness : 0 },
					{ visibility : "simplified" }
				]
			},{
				featureType : "road.highway",
				elementType : "labels",
				stylers : [
					{ saturation : -80 },
					{ lightness : 80 },
					{ visibility : "simplified" }
				]
			},{
				featureType : "road.arterial",
				elementType : "labels",
				stylers : [
					{color : "#ffffff" },
					{ lightness : 0 },
					{ visibility : "simplified" }
				]
			}
		]
	};


	
});
