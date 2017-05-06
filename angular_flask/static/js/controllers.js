'use strict';

/* Controllers */

function IndexController($scope, $http, $window) {
	console.log("loggedin at index: " + $window.sessionStorage.logged_in)

	if($window.sessionStorage.logged_in_status === 'true') {
		$scope.logged_in = true;
	} else {
		$scope.logged_in = false;
	}
}

function AboutController($scope) {

}

function HomeController($scope, $location, $window) {
	console.log("controllers.js - HomeController: phoning home...");
	if($window.sessionStorage.logged_in_status === 'true') {
		var userType = JSON.parse($window.sessionStorage.logged_in).userType;
		if(userType === 'admin') {
			$location.path('/admin');
		} else {
			$location.path('/course');
		}
	} else {
		$location.path('/login');
	}
}

function CourseListController($scope, Course, $http, $location, $window) {
	console.log("controllers.js - CourseListController: logged_in_status = " + $window.sessionStorage.logged_in_status);
	console.log("loggedin at course list: " + $window.sessionStorage.logged_in)
	if($window.sessionStorage.logged_in_status === 'true') {
		console.log('getting course list');
		$http.get('/api/course')
		.success(function(data, status) {
			if(status === 200 && data) {
				console.log('course list: ' + data);
				$scope.courses = data;
			} else {
				console.log(status);
				console.log("controllers.js - CourseListController: failed to get Course list");
			}
		})

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
				$location.path('/home')
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
	$location.path('/');
}

function CreateUserController($scope, $http, $location, $window) {
	console.log("controller.js - CreateUserController");
	if($window.sessionStorage.logged_in_status === 'true' && JSON.parse($window.sessionStorage.logged_in).userType === 'admin') {
		console.log("Accessing create_user as admin");
	} else {
		console.log("Accessing create_user as non-admin");
		$location.path('/');
	}

	$scope.create_user = function() {
		var username = $scope.username;
		var password = $scope.password;
		var userType = $scope.userType;

		$http.post('/api/user/create', {'username': username, 'password': password, 'userType': userType})
			.success(function(data, status) {
				if(status === 200) {
					console.log("controllers.js - CreateUserController create_user: SUCCESS");
					$location.path('/')
				}
			});
	}
}

function CreateCourseController($scope, $http, $location, $window) {
	console.log("controller.js - CreateCourseController");
	if($window.sessionStorage.logged_in_status === 'true' && JSON.parse($window.sessionStorage.logged_in).userType === 'admin') {
		console.log("Accessing create_course as admin");
	} else {
		console.log("Accessing create_course as non-admin");
		$location.path('/');
	}

	$scope.create_course = function() {
		var title = $scope.title;
		var description = $scope.description;
		var category = $scope.category;

		$http.post('/api/course/create', {'title': title, 'description': description, 'category': category})
			.success(function(data, status) {
				if(status === 200) {
					console.log("controllers.js - CreateCourseController create_course: SUCCESS");
					$location.path('/')
				}
			});
	}
}
