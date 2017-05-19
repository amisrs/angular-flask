'use strict';

/* Controllers */
var app = angular.module('AngularFlask');
app.controller('ProjectListController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
	$http.get('/api/project')
	.then(function(success) {
		$scope.open_projects = [];
		$scope.ongoing_projects = [];
		$scope.completed_projects = [];

		for(var i=0; i<success.data.length; i++) {
			if(success.data[i].status === 'open') {
				$scope.open_projects.push(success.data[i])
			} else if(success.data[i].status === 'ongoing') {
				$scope.ongoing_projects.push(success.data[i])
			} else if(success.data[i].status === 'completed') {
				$scope.completed_projects.push(success.data[i])
			}
		}
		// $scope.projects = success.data;
	}, function(error) {
		console.log(error);
	});
}])
.controller('ProjectListSponsorController', ['$scope', '$routeParams', 'Course', '$http', '$window', '$location', '$route', function ($scope, $routeParams, Course, $http, $window, $location, $route) {

	$http.get('/api/user/'+JSON.parse($window.sessionStorage.logged_in).UserID+'/sponsor')
		.then(function(success) {
			$http.get('/api/sponsor/'+success.data.SponsorID+'/project')
				.then(function(success) {
					$scope.open_projects = [];
					$scope.ongoing_projects = [];
					$scope.completed_projects = [];

					for(var i=0; i<success.data.length; i++) {
						if(success.data[i].status === 'open') {
							$scope.open_projects.push(success.data[i])
						} else if(success.data[i].status === 'ongoing') {
							$scope.ongoing_projects.push(success.data[i])
						} else if(success.data[i].status === 'completed') {
							$scope.completed_projects.push(success.data[i])
						}
					}
				}, function(error) {
					console.log(error);
				})
		})
}])
.controller('ProjectListStudentController', ['$scope', '$routeParams', 'Course', '$http', '$window', '$location', '$route', function ($scope, $routeParams, Course, $http, $window, $location, $route) {

	$http.get('/api/user/'+JSON.parse($window.sessionStorage.logged_in).UserID+'/student')
		.then(function(success) {
			$http.get('/api/student/'+success.data.StudentID+'/project')
				.then(function(success) {
					$scope.accepted_projects = success.data[0];
					$scope.other_projects = success.data[1];
				}, function(error) {
					console.log(error);
				})
		})
}])
.controller('ProjectDetailController', ['$scope', '$routeParams', 'Course', '$http', '$window', '$location', '$route', function ($scope, $routeParams, Course, $http, $window, $location, $route) {
	var project_endpoint = '';
	project_endpoint = '/api/project/' + $routeParams.ProjectID;
	$scope.applicants = [];

	$scope.showApplication = false;
	$scope.projectOngoing = false;
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
					get_application_for_student(studentId);
				}
				// console.log(success);
			}, function(error) {
				console.log(error);
			});
	} else {
		$scope.showApplication = false;
	}

  var get_application_for_student = function(studentId) {
		console.log("studentId: " + studentId);
		$http.get('/api/students/'+studentId)
			.then(function(success2) {
				// console.log
				// console.log(success2.data);
				$http.get(project_endpoint+'/application/'+studentId)
					.then(function(success3) {
						console.log(success3.data);
						success2.data.status = success3.data;
						$scope.applicants.push(success2.data);
					})

				// console.log($scope.applicants);
			}, function(error) {
				console.log(error);
			});
	}
	$http.get(project_endpoint)
		.then(function(success) {
			console.log("Got project data.");
			console.log(success);
			$scope.project = success.data;
			if($scope.project.status === "ongoing") {
				$scope.projectOngoing = true;
				get_student_user($scope.project.StudentID);

			}
		}, function(error) {
			console.log(status);
		});

	var get_student_user = function(StudentID) {
		$http.get('/api/students/'+StudentID)
			.then(function(success) {
				console.log("engaged");
				console.log(success);
				$scope.engagedApplicant = success.data;
			}, function(error) {
				console.log(error);
			})
	}
	$scope.eligible = false;
	if($scope.showApplication) {
		console.log("Getting eligibility...");
		$http.get('/api/user/'+JSON.parse($window.sessionStorage.logged_in).UserID+'/course')
			.then(function(success) {
				$scope.completed_courses = success.data[1];
				console.log($scope.completed_courses);
				for(var i=0; i<$scope.completed_courses.length; i++) {
					console.log($scope.completed_courses[i]);
					if($scope.project.requirements.indexOf($scope.completed_courses[i].title) !== -1) {
						$scope.eligible = true;
					}
				}
			})

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
	$scope.go_back = function() {
		$window.history.back();
	}

}]);
