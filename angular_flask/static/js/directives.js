'use strict';

/* Directives */

angular.module('angularDirectives', [])
.controller('login-controller', ['$scope', '$window', function($scope, $window) {
  console.log('login-controller')

  var updateLogin = function() {
    $scope.logged_in_status = $window.sessionStorage.logged_in_status;
    $scope.logged_in = $window.sessionStorage.logged_in;
    console.log("updateLogin:");
    console.log("scope.logged_in: " + $scope.logged_in);
    console.log("scope.logged_in_status: " + $scope.logged_in_status);

    if($scope.logged_in_status === 'true') {
      $scope.href = '/logout';
      $scope.login_text = 'Hello ' + JSON.parse($scope.logged_in).login;

    } else {
      $scope.href = '/login';
      $scope.login_text = 'Login';
    }


    console.log("directives.js - updateLogin: href is " + $scope.href);
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
    template: "<h2>{{ category }}</h2><div ng-repeat=\"course in courses\"><h4><a href=\"/course/{{ course.CourseID }}\">{{ course.title }}</a></h4><p>{{ course.description }}<p></div>"
  }
})
.directive('userSnippet', function() {
  return {
    restrict: 'E',
    template: "<b>{{ user.login }}:</b> {{ user.userType }}"
  }
});
