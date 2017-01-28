app.directive('datepicker', ['$document',function ($document) {
	var directive_controller=['$scope','$state','$stateParams',function($scope,$state,$stateParams){
		var months=['January','February','March','April','May','June','July','August','September','October','Novermber','December'];
		$scope.maindate=angular.copy($scope.todate);
		$scope.showdata=function(){
			var d = new Date($scope.maindate);
			$scope.month=months[d.getMonth()];
			if($scope.togodate=='None')
			{

			}
			else
			{
				$scope.giveoutdate=$scope.togodate;
			}
			$scope.year=$scope.maindate.substring(0,4);
			if(leapYear($scope.year))
			{
				var daysinmonths=[31,29,31,30,31,30,31,31,30,31,30,31];
			}
			else
			{
				var daysinmonths=[31,28,31,30,31,30,31,31,30,31,30,31];
			}
			var my=$scope.maindate.substring(0,8);
			$scope.output=[];
			fdate=new Date(my+'01');
			var counts=0;
			$scope.output[0]=[];
			for(j=1;j<=fdate.getDay();j++)
			{
				$scope.output[0].push(['','','none']);
			}
			for(var i=1;i<=daysinmonths[d.getMonth()];i++)
			{
				if(i<10)
				{
					var md=my+'0'+i;
				}
				else
				{
					var md=my+i;
				}
				var mdates=new Date(md);
				var td=mdates.getDay();
				if(td==0)
				{
					counts++;
					$scope.output[counts]=[];
				}
				if(md<$scope.todate)
				{
					acts='date_inactive';
				}
				else
				{
					if(md==$scope.todate)
					{
						acts='date_active today';
					}
					else
					{
						acts='date_active';
					}
				}
				$scope.output[counts].push([i,md,acts]);
			}
		}

		$scope.goleft=function(){
			var mon=$scope.maindate.substring(5,7);
			var year=$scope.maindate.substring(0,4);
			if(mon=='01')
			{
				nyear=parseInt(year)-1;
				$scope.maindate=nyear+'-'+'12-01';
			}
			else
			{
				nmon=parseInt(mon)-1;
				if(nmon<10)
				{
					nmon='0'+nmon;
				}
				else
				{
					nmon=nmon+'';
				}
				$scope.maindate=year+'-'+nmon+'-01';
			}
			$scope.showdata();
		}

		$scope.goright=function(){
			var mon=$scope.maindate.substring(5,7);
			var year=$scope.maindate.substring(0,4);
			if(mon=='12')
			{
				nyear=parseInt(year)+1;
				$scope.maindate=nyear+'-'+'01-01';
			}
			else
			{
				nmon=parseInt(mon)+1;
				if(nmon<10)
				{
					nmon='0'+nmon;
				}
				else
				{
					nmon=nmon+'';
				}
				$scope.maindate=year+'-'+nmon+'-01';
			}
			$scope.showdata();
		}

		$scope.giveback=function(m){
			if(m[2]=='date_active' || m[2]=='date_active today')
			{
				$scope.outputdate=m[1];
				$scope.giveoutdate=$scope.outputdate.substring(8,11)+'-'+$scope.outputdate.substring(5,7)+'-'+$scope.outputdate.substring(0,4);
				$scope.showcal=false;
			}
		}

		$scope.showdata();
		$scope.showcal=false;

		$scope.show_calendar=function(){
			if($scope.giveoutdate && $scope.giveoutdate!='From' && $scope.giveoutdate!='To')
			{
				var f=$scope.giveoutdate;
				$scope.maindate=f.substring(6,11)+'-'+f.substring(3,5)+'-'+f.substring(0,2);
			}
			else
			{
				$scope.maindate=angular.copy($scope.todate);
			}
			$scope.showdata();
			$scope.showcal=true;
		}

		function leapYear(year)
		{
			return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
		}
	}];
	return {
		restrict: 'E',
		require:'?ngModel',
		scope:{
			todate:'@',
			placeholderdata:'@',
			togodate:'@'
		},
		controller: directive_controller,
		link: function(scope,element,attr,ngModel){
			scope.$watch('giveoutdate',function(){
				ngModel.$setViewValue(scope.giveoutdate);
			});
			element.data('clicks',true);
			$document.bind('click',function(e){
				if(angular.element(e.target).inheritedData('clicks'))
				{

				}
				else{
					scope.showcal=false;
					scope.$apply();
				}
			});
		},
		templateUrl:'partials/calendar.html'
	};
}]);