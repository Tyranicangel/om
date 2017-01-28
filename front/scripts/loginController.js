app.controller('LoginController', ['$scope','$http','$stateParams','$state', 'Logging', function ($scope,$http,$stateParams,$state, Logging) {
	$scope.popupwrapper = false;
	$scope.popupsignin = false;
	$scope.popupsignup = false;
	$scope.popupforgot = false;
	$scope.popupchangepass = false;
	$scope.registererror = false;
	$scope.loginerror = false;
	$scope.user={};

	if(localStorage.token != "") {
		$http({
		method:'GET',
		url:$scope.requesturl+'get_user',
		headers:{'X-CSRFToken':localStorage.token}
		}).
		success(function(result){ 
			$scope.user = result[0];
		});
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
	}

	$scope.closepopup = function() {
		$scope.popupwrapper = false;
		$scope.popupsignin = false;
		$scope.popupsignup = false;
		$scope.popupforgot = false;
		$scope.popupchangepass = false;
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
					$scope.closepopup();
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

}]);