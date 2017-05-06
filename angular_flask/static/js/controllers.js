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
		} else {
			$location.path('/course');
		}
	} else {
		$location.path('/login');
	}
}])
.controller('StudentHomeController', ['$scope', '$location', '$window', function ($scope, $location, $window) {
	console.log("controllers.js - StudentHomeController: phoning home...");
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
			.then(function(data, status) {
				if(status === 200) {
					console.log("controllers.js - CreateUserController create_user: then");
					$location.path('/home')
				}
			});
	}
}])
.controller('UserListController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
	$http.get('/api/user')
	.then(function(data, status) {
		if(status === 200 && data) {
			$scope.users = data;
		} else {
			console.log(status);
			console.log("controllers.js - UserListController: failed to get User list");
		}
	})
}]);
