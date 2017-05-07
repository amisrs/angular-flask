'use strict';

/* Controllers */
var app = angular.module('AngularFlask');
app.controller('IndexController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
	console.log("loggedin at index: " + $window.sessionStorage.logged_in);

	if($window.sessionStorage.logged_in_status === 'true') {
		$scope.logged_in = true;
	} else {
		$scope.logged_in = false;
	}
}])
.controller('HomeController', ['$scope', '$location', '$window', function ($scope, $location, $window) {
	console.log("controllers.js - HomeController: phoning home...");
	if($window.sessionStorage.logged_in_status === 'true') {
		var userType = JSON.parse($window.sessionStorage.logged_in).userType;
		if(userType === 'admin') {
			$location.path('/admin');
		} else if(userType === 'student') {
			$location.path('/course');
		} else if(userType === 'supervisor') {
			$location.path('/students');
		}
	} else {
		$location.path('/login');
	}
}])
.controller('StudentHomeController', ['$scope', '$location', '$window', function ($scope, $location, $window) {
	console.log("controllers.js - StudentHomeController: phoning home...");
}])
.controller('SupervisorHomeController', ['$scope', '$location', '$window', function($scope, $location, $window) {
	console.log("controllers.js - SupervisorHomeController: phoning home...");
	$scope.isShowingNew = false;

	$scope.showNew = function() {
		console.log("SHOW NEW");
		$scope.isShowingNew = true;
	}
	$scope.hideNew = function() {
		console.log("HIDE NEW");
		$scope.isShowingNew = false;
	}
}])
.controller('LoginController', ['$scope', '$http', '$location', '$window', '$rootScope', function ($scope, $http, $location, $window, $rootScope) {

	$scope.login = function() {
		console.log("ANGULAR LOGIN");
		var username = $scope.username;
		var password = $scope.password;

		$http.post('/api/login', {'username': username, 'password': password})
		.then(function(success) {
				$window.sessionStorage.setItem("logged_in", JSON.stringify(success.data.user));
				console.log("controllers.js - LoginController: Setting localstorage user: " + $window.sessionStorage.logged_in);
				$window.sessionStorage.setItem("logged_in_status", true)

				$rootScope.$broadcast('login-change');
				$location.path('/home')
		}, function(error) {
				console.log(error);
		})
	}
}])
.controller('LogoutController', ['$scope', '$location', '$window', '$route', '$rootScope', function ($scope, $location, $window, $route, $rootScope) {
	console.log("controller.js - LogoutController");
	if($window.sessionStorage.logged_in_status === 'true') {
		$window.sessionStorage.setItem("logged_in_status", false);
		$window.sessionStorage.setItem("logged_in", null);

	}
	$rootScope.$broadcast('login-change');
	$location.path('/');
}])
.controller('CreateStudentController', ['$scope', '$http', '$location', '$window', function ($scope, $http, $location, $window) {
	if($window.sessionStorage.logged_in_status === 'true' && JSON.parse($window.sessionStorage.logged_in).userType === 'supervisor') {
		console.log("Accessing create_student as supervisor");
	} else {
		console.log("Accessing create_student as non-supervisor");
		$location.path('/home');
	}

	$scope.create_student = function() {
		console.log("CREATE STUDENT");
		var username = $scope.username;
		var FirstName = $scope.FirstName;
		var LastName = $scope.LastName;
		var password = $scope.password;

		$http.post('/api/user/create', {'username': username, 'FirstName': FirstName, 'LastName': LastName, 'password': password, 'userType': 'student'})
			.then(function(success) {
				console.log("controllers.js - CreateUserController create_user: then");
				$location.path('/home');
			}, function(error) {
				console.log(error);
			});

	}

}])
.controller('CreateUserController', ['$scope', '$http', '$location', '$window', function ($scope, $http, $location, $window) {
	console.log("controller.js - CreateUserController");
	if($window.sessionStorage.logged_in_status === 'true' && JSON.parse($window.sessionStorage.logged_in).userType === 'admin') {
		console.log("Accessing create_user as admin");
	} else {
		console.log("Accessing create_user as non-admin");
		$location.path('/home');
	}

	$scope.create_user = function() {
		var username = $scope.username;
		var password = $scope.password;
		var userType = $scope.userType;

		$http.post('/api/user/create', {'username': username, 'password': password, 'userType': userType})
			.then(function(success) {
				console.log("controllers.js - CreateUserController create_user: then");
				$location.path('/home');
			}, function(error) {
				console.log(error);
			});
	}
}])
.controller('UserListController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
	$http.get('/api/user')
	.then(function(success) {
			$scope.users = success.data;
	}, function(error) {
		console.log(error);
		console.log("controllers.js - UserListController: failed to get User list");
	});
}])
.controller('StudentListController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
	var endpoint = '/api/supervisor/' + JSON.parse($window.sessionStorage.logged_in).UserID + '/student'
	$http.get(endpoint)
		.then(function(success) {
			console.log("students");
			console.log(success);

			$scope.students = [];
			for(var i = success.data.length - 1; i >= 0; i--) {
				console.log(i);
				var current_student = success.data[i];
				get_enrolled_courses(current_student);
				console.log(current_student);
				$scope.students.push(current_student);
			}
		}, function(error) {
			console.log(error);
		});

		var get_enrolled_courses = function(current_student) {
			$http.get('/api/user/' + current_student.UserID + '/course')
				.then(function(success) {
					console.log("enroleld courses for: " + current_student.login);
					console.log(success.data);
					current_student.enrolled_courses = success.data;
				}, function(error) {
					console.log(error);
				});
		}
}]);
