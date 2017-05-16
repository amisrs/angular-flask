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
		} else if(userType ==='sponsor') {
			$location.path('/project');
		}
	} else {
		$location.path('/login');
	}
}])
.controller('SponsorHomeController', ['$scope', '$location', '$window', function ($scope, $location, $window) {
	console.log("controllers.js - SponsorHomeController: phoning home...");
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
.controller('CreateProjectController', ['$scope', '$http', '$location', '$window', function ($scope, $http, $location, $window) {
	$scope.create_project = function() {
		var title = $scope.title;
		var description = $scope.description;
		var category = $scope.category;

		//http post
		$http.post('/api/project/create', {'title': title, 'description': description, 'category': category})
			.then(function(success) {
				$location.path("/home");
			}, function(error) {
				console.log(error);
			});
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
.controller('RegisterController', ['$scope', '$http', '$location', '$window', '$rootScope', function($scope, $http, $location, $window, $rootScope) {

	$scope.register = function() {
		var username = $scope.username;
		var email = $scope.email;
		var password = $scope.password;

		//http post
		$http.post('/api/user/create', {'username': username, 'email': email, 'password': password, 'userType': 'sponsor'})
			.then(function(success) {
				$http.post('/api/login', {'username': username, 'password': password})
				.then(function(success) {
						$window.sessionStorage.setItem("logged_in", JSON.stringify(success.data.user));
						$window.sessionStorage.setItem("logged_in_status", true)
						$rootScope.$broadcast('login-change');
						$location.path('/home')
				}, function(error) {
						console.log(error);
				})
			}, function(error) {
				console.log(error);
			});
	}
}])
.controller('LoginController', ['$scope', '$http', '$location', '$window', '$rootScope', function ($scope, $http, $location, $window, $rootScope) {
	if($window.sessionStorage.logged_in_status === 'true') {
		$location.path('/home');
	}
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
.controller('ProjectListController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
	$http.get('/api/project')
	.then(function(success) {
		$scope.projects = success.data;
	}, function(error) {
		console.log(error);
	});
}])
.controller('ProjectDetailController', ['$scope', '$routeParams', 'Course', '$http', '$window', '$location', '$route', function ($scope, $routeParams, Course, $http, $window, $location, $route) {
	var project_endpoint = '';
	project_endpoint = '/api/project/' + $routeParams.ProjectID;
	$scope.applicants = [];

	$scope.showApplication = false;
	var userType = JSON.parse($window.sessionStorage.logged_in).userType;
	$scope.userType = userType;
	if(userType === 'student') {
		console.log("show appl");
		$scope.showApplication = true;
	} else if(userType === 'sponsor') {
		$scope.showApplication = false;
		$http.get(project_endpoint+'/apply')
			.then(function(success) {
				console.log("Got applicants data.");
				// console.log(success.data);
				$scope.applications = success.data;
				console.log("len:"+$scope.applications.length);
				for(var i=0; i<$scope.applications.length; i++) {
					//http get the student by id
					console.log("i " + i);
					console.log("app[i] " + $scope.applications[i].StudentID);
					var ep = '/api/students/'+$scope.applications[i].StudentID;
					console.log("ep = " + ep);

					var studentId = $scope.applications[i].StudentID;

					$http.get('/api/students/'+studentId)
						.then(function(success2) {
							// console.log
							console.log(success2.data);
							$http.get(project_endpoint+'/application/'+studentId)
								.then(function(success3) {
									success2.data.status = success3.data;
									$scope.applicants.push(success2.data);
								})

							// console.log($scope.applicants);
						}, function(error) {
							console.log(error);
						});
				}
				console.log(success);
			}, function(error) {
				console.log(error);
			});
	} else {
		$scope.showApplication = false;
	}


	$http.get(project_endpoint)
		.then(function(success) {
			console.log("Got project data.");
			$scope.project = success.data;
		}, function(error) {
			console.log(status);
		});

	if($scope.showApplication) {
		console.log("Getting application status...");
		$http.get(project_endpoint+'/apply')
			.then(function(success) {
				console.log(success);
				$scope.data = success.data;
				console.log($scope.data);
				if($scope.data.length !== 0) {
					$scope.hasApplied = true;
				} else {
					$scope.hasApplied = false;
				}

			}, function(error) {
				console.log(status);
			});
	}

	$scope.apply = function() {
		$http.post(project_endpoint+'/apply', {'UserID': $window.sessionStorage.logged_in.UserID })
			.then(function(success) {
				$route.reload();
			}, function(error) {
				console.log(error);
			});
	}

	$scope.cancel = function() {
		$http.post(project_endpoint+'/cancel', {'UserID': $window.sessionStorage.logged_in.UserID })
			.then(function(success) {
				$route.reload();
			}, function(error) {
				console.log(error);
			});
	}

	$scope.accept = function(studentId) {
		console.log("triggerd accept: " + studentId);
		$http.post(project_endpoint+'/application/'+studentId)
			.then(function(success) {
				console.log("post accept success");
				$route.reload();
			}, function(error) {
				console.log(error);
			});
	}

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
