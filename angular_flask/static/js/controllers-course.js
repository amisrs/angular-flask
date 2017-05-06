'use strict';

/* Controllers */
var app = angular.module('AngularFlask');
app.controller('CreateCourseController', ['$scope', '$http', '$location', '$window', function ($scope, $http, $location, $window) {
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
			.then(function(success) {
				$location.path('/')
			}, function(error) {
				console.log(error)
			})
	}
}])
.controller('CourseListController', ['$scope', '$http', '$location', '$window', function ($scope, $http, $location, $window) {
	console.log("controllers.js - CourseListController: logged_in_status = " + $window.sessionStorage.logged_in_status);
	console.log("loggedin at course list: " + $window.sessionStorage.logged_in)
	if($window.sessionStorage.logged_in_status === 'true') {
		// console.log('getting course list');
		// $http.get('/api/course')
		// .then(function(data, status) {
		// 	if(status === 200 && data) {
		// 		console.log('course list: ' + data);
		// 		$scope.courses = data;
		// 	} else {
		// 		console.log(status);
		// 		console.log("controllers.js - CourseListController: failed to get Course list");
		// 	}
		// })

		// get unique categories from db instead of this crap
		$scope.categories = ['programming', 'magic'];

	} else {
		console.log('not logged in')
		$location.path('/login')
	}
}])
.controller('EnrolledCourseListController', ['$scope', '$http', '$location', '$window', function ($scope, $http, $location, $window) {
	if($window.sessionStorage.logged_in_status === 'true') {
		console.log(JSON.parse($window.sessionStorage.logged_in).UserID);
		var enrolled_course_endpoint = '/api/user/' + JSON.parse($window.sessionStorage.logged_in).UserID + '/course';

		$http.get(enrolled_course_endpoint)
			.then(function(success) {
				console.log(success.data);
				$scope.courses = success.data;
			}, function(error) {
				console.log(error);
			})
	}
}])
.controller('CourseCategoryController', ['$scope', '$window', '$http', function ($scope, $window, $http) {
	var unenrolled_course_endpoint = '/api/user/' + JSON.parse($window.sessionStorage.logged_in).UserID + '/unenrolled';
	$scope.empty = { value: false };
	$scope.emptyMessage = "";
	console.log("CATEGORY : " + $scope.category);
  $http.get(unenrolled_course_endpoint)
  .then(function(success) {
		console.log("success data for" + $scope.category + "next");
		var dataCopy = JSON.parse(JSON.stringify(success.data));
		console.log(dataCopy);
		console.log(dataCopy.length);
		for(var i = dataCopy.length - 1; i >= 0 ; i--) {
			console.log(i+" Comparing: " + dataCopy[i].title + '-'+ dataCopy[i].category + " vs " + $scope.category);

			if(dataCopy[i].category !== $scope.category) {
				console.log(dataCopy[i].title + " doesnt eblon in " + $scope.category);
				console.log(JSON.stringify(dataCopy));
				dataCopy.splice(i, 1);
				console.log(JSON.stringify(dataCopy));

			}

			console.log("The following eblon in " + $scope.category);
			console.log(dataCopy);
			if(dataCopy.length === 0) {
				console.log("emtpy category " + $scope.category);
				$scope.emptyMessage = "You're in all of the courses already!!";
				$scope.empty.value = true;
			}

			$scope.courses = dataCopy;

		}

		// success.data.forEach(function(element, index) {
		// 	console.log("Comparing: " + element.title + '-'+ element.category + " vs " + $scope.category);
		// 	if(element.category !== $scope.category) {
		// 		console.log(element.title + " doesnt eblon in " + $scope.category);
		// 		console.log(JSON.stringify(dataCopy));
		//
		// 		dataCopy.splice(index, 1);
		// 		console.log(JSON.stringify(dataCopy));
		// 	} else {
		// 		console.log(element.title + " eblons in " + $scope.category);
		// 	}
		// })
	}, function(error) {
    console.log(error);
    console.log("controllers.js - CourseListController: failed to get Course list");
  })
}])
.controller('CourseDetailController', ['$scope', '$routeParams', 'Course', '$http', '$window', '$location', function ($scope, $routeParams, Course, $http, $window, $location) {
	$scope.isEnrolled = false;
	var course_endpoint = '';
	var course_unenrol_endpoint = '';

	console.log("controllers-course.js");
	var courseQuery = Course.get({ CourseID: $routeParams.CourseID }, function(course) {
		$scope.course = course;
		console.log("COURSE: " + course);
		course_endpoint = '/api/course/' + $scope.course.CourseID + '/enrol';
		course_unenrol_endpoint = '/api/course/' + $scope.course.CourseID + '/unenrol';

		$http.get(course_endpoint, {'UserID': $window.sessionStorage.logged_in.UserID})
			.then(function(success) {
				success.data === 'True' ? $scope.isEnrolled = true : $scope.isEnrolled = false;
				console.log("isEnrolled " + $scope.isEnrolled)
			}, function(error) {
				console.log(status);
			});
	});
	console.log("HEY DUDE");

	$scope.enrol = function() {
		console.log("controllers-course.js - " + course_endpoint);
		$http.post(course_endpoint, {'UserID': $window.sessionStorage.logged_in.UserID })
			.then(function(success) {
				$location.path('/home');
			}, function(error) {
				console.log(error);
			});
	}

	$scope.unenrol = function() {
		$http.post(course_unenrol_endpoint, {'UserID': $window.sessionStorage.logged_in.UserID })
			.then(function(success) {
				$location.path('/home');
			}, function(error) {
				console.log(error);
			});
	}
	//get the stuff from first page here
}]);
