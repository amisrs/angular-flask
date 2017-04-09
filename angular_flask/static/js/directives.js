'use strict';

/* Directives */

angular.module('angularDirectives', [])
.controller('login-controller', ['$scope', '$window', function($scope, $window) {
  console.log('login-controller')

  var updateLogin = function() {
    $scope.logged_in = $window.sessionStorage.logged_in
    if($scope.logged_in == 'true') {
      $scope.href = '/logout';
    } else {
      $scope.href = '/login';
    }
  }

  updateLogin();

  $scope.$on('login-change', function(event, args) {
    updateLogin();
  })
}])
.directive('customNgLogin', function() {
  console.log('login directive')
  return {
    restrict: 'E',
    template: '<a href="{{ href }}">Logged in: {{ logged_in }}</a>'
  };
});
