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
    } else {
      $scope.href = '/login';
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
    template: '<a href="{{ href }}">Hello {{ logged_in }}</a>'
  };
});
