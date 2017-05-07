'use strict';

/* Directives */

angular.module('angularDirectives', [])
.controller('login-controller', ['$scope', '$window', function($scope, $window) {
  console.log('login-controller')

  var updateLogin = function() {
    $scope.logged_in_status = $window.sessionStorage.logged_in_status;
    $scope.logged_in = $window.sessionStorage.logged_in;

    if($scope.logged_in_status === 'true') {
      $scope.href = '/logout';
      $scope.login_text = 'Hello ' + JSON.parse($scope.logged_in).login;

    } else {
      $scope.href = '/login';
      $scope.login_text = 'Login';
    }


  }

  updateLogin();

  $scope.$on('login-change', function(event, args) {
    console.log("on login change");
    updateLogin();
  })
}])
.directive('customNgLogin', function() {
  console.log('login directive')
  return {
    restrict: 'E',
    template: "<a href='{{ href }}'> {{ login_text }}</a>"
  };
})
.directive('coursesByCategory', function() {
  return {
    restrict: 'E',
    template: "<h2>{{ category }}</h2>{{ emptyMessage }}<category-carousel></category-carousel>"
  }
})
.directive('categoryCarousel', function() {
  return {
    restrict: 'E',
    template: "<carousel><slide ng-repeat=\"course in courses\"><div ng-include src=\"'static/partials/course_tile.html'\"></div></slide></carousel>"
  }
})
.directive('allCarousel', function() {
  return {
    restrict: 'E',
    template: "<carousel><slide ng-repeat=\"course in courses\"><div ng-include src=\"'static/partials/course_tile.html'\"></div></slide></carousel>"
  }
})
.directive('userSnippet', function() {
  return {
    restrict: 'E',
    template: "<b>{{ user.login }}:</b> {{ user.userType }}"
  }
})
.directive('studentTable', function() {
  return {
    restrict: 'E',
    template: "<table class=\"table\"><thead><tr><th>#</th><th>Username</th><th>Ongoing Courses</th></tr><thead><tbody><tr ng-repeat=\"student in students\" ng-include src=\"'static/partials/student_row.html'\"></tr></tbody></table>"
  }
});
