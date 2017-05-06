'use strict';

/* Controllers */

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
function CourseListController($scope, Course, $http, $location, $window) {
	console.log("controllers.js - CourseListController: logged_in_status = " + $window.sessionStorage.logged_in_status);
	console.log("loggedin at course list: " + $window.sessionStorage.logged_in)
	if($window.sessionStorage.logged_in_status === 'true') {
		// console.log('getting course list');
		// $http.get('/api/course')
		// .success(function(data, status) {
		// 	if(status === 200 && data) {
		// 		console.log('course list: ' + data);
		// 		$scope.courses = data;
		// 	} else {
		// 		console.log(status);
		// 		console.log("controllers.js - CourseListController: failed to get Course list");
		// 	}
		// })
		$scope.categories = ['programming', 'magic'];

	} else {
		console.log('not logged in')
		$location.path('/login')
	}
}

function CourseCategoryController($scope, $window, $http) {
	  // replace this with call to database
  console.log("directives.js - course-category-controller");
	//console.log("CATEGORY : " + $scope.category);
  $http.get('/api/course')
  .success(function(data, status) {
    if(status === 200 && data) {
      //console.log('course list: ' + data);
			//console.log('data 0: ' + data[0]);
			data.forEach(function(element, index, object) {
				//console.log("Comparing: " + element.category + " vs " + $scope.category);
				if(element.category !== $scope.category) {
					object.splice(index, 1);
				}
			})
      $scope.courses = data;
    } else {
      console.log(status);
      console.log("controllers.js - CourseListController: failed to get Course list");
    }
  })
}


function CourseDetailController($scope, $routeParams, Course, $http, $window, $location) {
	$scope.isEnrolled = false;
	var course_endpoint = '';
	console.log("controllers-course.js");
	var courseQuery = Course.get({ CourseID: $routeParams.CourseID }, function(course) {
		$scope.course = course;
		console.log("COURSE: " + course);
		course_endpoint = '/api/course/' + $scope.course.CourseID + '/enrol';
		$http.get(course_endpoint, {'UserID': $window.sessionStorage.logged_in.UserID})
			.success(function(data, status) {
				console.log("controllers-course.js - CourseDetailController GET");
				if(status === 200) {
					console.log("controllers-course.js - CourseDetailController GET enrol: SUCCESS");
					data === 'True' ? $scope.isEnrolled = true : $scope.isEnrolled = false;
					console.log("isEnrolled " + $scope.isEnrolled)
				} else {
					console.log(status);
				}
			});
	});
	console.log("HEY DUDE");

	$scope.enrol = function(arg1) {
		console.log("controllers-course.js - " + course_endpoint);
		$http.post(course_endpoint, {'UserID': $window.sessionStorage.logged_in.UserID })
			.success(function(data, status) {
				if(status === 200) {
					console.log("controllers-course.js - CourseDetailController enrol: SUCCESS");
					$location.path('/home');
				}
			});

	}
	//get the stuff from first page here
}
