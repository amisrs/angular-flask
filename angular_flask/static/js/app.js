'use strict';

angular.module('AngularFlask', ['angularFlaskServices', 'angularDirectives'])
	.run(function($window) {
		console.log('run init')
		if(!$window.sessionStorage.logged_in) {
			$window.sessionStorage.logged_in = 'false';
		}
	})
	.config(['$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider) {
		$routeProvider
		.when('/', {
			templateUrl: 'static/partials/landing.html',
			controller: IndexController
		})
		.when('/about', {
			templateUrl: 'static/partials/about.html',
			controller: AboutController
		})
		.when('/course', {
			templateUrl: 'static/partials/course-list.html',
			controller: CourseListController
		})
		.when('/course/:CourseID', {
			templateUrl: '/static/partials/course-detail.html',
			controller: CourseDetailController
		})
		/* Create a "/blog" route that takes the user to the same place as "/post" */
		.when('/blog', {
			templateUrl: 'static/partials/course-list.html',
			controller: CourseListController
		})
		.when('/login', {
			templateUrl: 'static/partials/login.html',
			controller: LoginController
		})
		.when('/logout', {
			templateUrl: 'static/partials/landing.html',
			controller: LogoutController
		})
		.otherwise({
			redirectTo: '/'
		})
		;

		$locationProvider.html5Mode(true);
	}])
;
