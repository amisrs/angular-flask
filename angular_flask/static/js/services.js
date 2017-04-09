'use strict';

angular.module('angularFlaskServices', ['ngResource'])
	.factory('Course', function($resource) {
		return $resource('/api/course/:CourseID', {}, {
			query: {
				method: 'GET',
				params: { CourseID: '' },
				isArray: true
			}
		});
	})
	.factory('Page', function($resource) {
		return $resource('/api/page/:PageID', {}, {
			query: {
				method: 'GET',
				params: { PageID: '' },
				isArray: true
			}
		});
	})
;
