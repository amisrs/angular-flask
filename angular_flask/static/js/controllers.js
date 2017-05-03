'use strict';

/* Controllers */

function IndexController($scope, $http, $window) {
	console.log("loggedin at index: " + $window.sessionStorage.logged_in)

	if($window.sessionStorage.logged_in_status === true) {
		$scope.logged_in = true;
	} else {
		$scope.logged_in = false;
	}
}

function AboutController($scope) {

}

function CourseListController($scope, Course, $http, $location, $window) {
	console.log("controllers.js - CourseListController: logged_in_status = " + $window.sessionStorage.logged_in_status);
	console.log("loggedin at course list: " + $window.sessionStorage.logged_in)
	if($window.sessionStorage.logged_in_status === 'true') {
		console.log('getting course list');
		var coursesQuery = Course.get({}, function(courses) {
			$scope.courses = courses.objects;
			console.log('got course objects ' + courses.objects);
		});
	} else {
		console.log('not logged in')
		$location.path('/login')
	}
}

function CourseDetailController($scope, $routeParams, Course, $http) {
	var courseQuery = Course.get({ CourseID: $routeParams.CourseID }, function(course) {
		$scope.course = course;
	});

	//get the stuff from first page here
}

function LoginController($scope, $http, $location, $window, $rootScope) {
	if($window.sessionStorage.logged_in_status === 'true') {
		$location.path('/course')
	}

	$scope.login = function() {
		console.log("ANGULAR LOGIN");
		var username = $scope.username;
		var password = $scope.password;

		$http.post('/api/login', {'username': username, 'password': password})
		.success(function(data, status) {
			if(status === 200 && data.result) {
				console.log("login successas");
				console.log(data.user);
				$window.sessionStorage.setItem("logged_in", JSON.stringify(data.user));
				console.log("controllers.js - LoginController: Setting localstorage user: " + $window.sessionStorage.logged_in);
				$window.sessionStorage.setItem("logged_in_status", true)

				$rootScope.$broadcast('login-change');
				$location.path('/course/')
			} else {
				console.log("login failed")
				console.log(data.result)
			}
		})
	}
}

function LogoutController($scope, $location, $window, $route, $rootScope) {
	console.log("controller.js - LogoutController");
	if($window.sessionStorage.logged_in_status === 'true') {
		$window.sessionStorage.setItem("logged_in_status", false);
		$window.sessionStorage.setItem("logged_in", null);

	}
	$rootScope.$broadcast('login-change');
	$location.path('/')
}
