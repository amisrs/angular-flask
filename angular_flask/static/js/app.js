'use strict';

angular.module('AngularFlask', ['angularFlaskServices', 'angularDirectives', 'ngRoute', 'ui.bootstrap', 'angular-carousel', 'ngTouch', 'ngAnimate', 'angularModalService'])
	.run(function($window) {
		console.log('app.js - run init')
		if(!$window.sessionStorage.logged_in) {
			$window.sessionStorage.logged_in = 'false';
		}
	})
	.config(['$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider) {
		$routeProvider
		.when('/', {
			templateUrl: 'static/partials/landing.html',
			controller: 'IndexController'
		})
		.when('/about', {
			templateUrl: 'static/partials/about.html',
		})
		.when('/course', {
			templateUrl: 'static/partials/student_home.html',
			controller: 'StudentHomeController'
		})
		.when('/course/:CourseID', {
			templateUrl: '/static/partials/course/course-detail.html',
			controller: 'CourseDetailController'
		})
		.when('/register', {
			templateUrl: 'static/partials/register.html',
			controller: 'RegisterController'
		})
		.when('/login', {
			templateUrl: 'static/partials/login.html',
			controller: 'LoginController'
		})
		.when('/students', {
			templateUrl: 'static/partials/supervisor_home.html',
			controller: 'SupervisorHomeController'
		})
		.when('/student/:StudentID', {
			templateUrl: '/static/partials/student/student_profile.html',
			controller: 'StudentProfileController'
		})
		.when('/project', {
			templateUrl: 'static/partials/sponsor_home.html',
			controller: 'SponsorHomeController'
		})
		.when('/project/:ProjectID', {
			templateUrl: 'static/partials/project/project_detail.html',
			controller: 'ProjectDetailController'
		})
		.when('/logout', {
			templateUrl: 'static/partials/landing.html',
			controller: 'LogoutController'
		})
		.when('/admin', {
			templateUrl: '/static/partials/admin.html',
		})
		.when('/admin/create_user', {
			templateUrl: '/static/partials/create_user.html',
			controller: 'CreateUserController'
		})
		.when('/admin/create_course', {
			templateUrl: '/static/partials/course/create_course.html',
			controller: 'CreateCourseController'
		})
		.when('/home', {
			templateUrl: 'static/partials/login.html',
			controller: 'HomeController'
		})
		.otherwise({
			redirectTo: '/'
		})
		;

		$locationProvider.html5Mode(true);
		$locationProvider.hashPrefix("");

	}])
;
