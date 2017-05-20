'use strict';

/* Directives */

angular.module('angularDirectives', [])
.controller('login-controller', ['$scope', '$window', '$location', '$route', '$http', function($scope, $window, $location, $route, $http) {
  console.log('login-controller')
  console.log($location.path());
  $scope.showNavbar = true;
  if($location.path === '/') {
    $scope.showNavbar = false;
  }
  $scope.location = $location.path();


  var updateLogin = function() {
    $scope.logged_in_status = $window.sessionStorage.logged_in_status;
    $scope.logged_in = $window.sessionStorage.logged_in;

    if($scope.logged_in_status === 'true') {
      $scope.href = '/logout';
      // $scope.login_text = 'Hello ' + JSON.parse($scope.logged_in).login;
      $scope.login_text = JSON.parse($scope.logged_in).login;
    } else {
      $scope.href = '/login';
      $scope.login_text = 'Login';
    }
    $route.reload();
  }

  updateLogin();

  $scope.$on('login-change', function(event, args) {
    console.log("on login change");
    updateLogin();
  })

  $scope.profile = function() {
    console.log("profile");
    if($window.sessionStorage.logged_in_status === 'true') {
      var user = JSON.parse($window.sessionStorage.logged_in);
      console.log(user);
      if(user.userType === 'admin') {
        $location.path('/admin');
      } else if(user.userType === 'student') {
        $http.get('/api/user/'+user.UserID+'/student')
          .then(function(success) {
            $location.path('/student/'+success.data.StudentID);
          }, function(error) {
            console.log(error);
          });


      } else if(user.userType === 'supervisor') {
        $location.path('/students');
      } else if(user.userType ==='sponsor') {
        $location.path('/project');
      }
    } else {
      $location.path('/login');
    }
  }
}])
.directive('customNgLogin', function() {
  console.log('login directive')
  return {
    restrict: 'E',
    template: "<a href='{{ href }}'>{{ login_text }}</a>"
  };
})
.directive('coursesByCategory', function() {
  return {
    restrict: 'E',
    template: "<h4 class=\"capitalize\">{{ category }}</h4>{{ emptyMessage }}<category-carousel></category-carousel>"
  }
})
.directive('categoryCarousel', function() {
  return {
    restrict: 'E',
    template: "<carousel disable-animation=\"true\"><slide ng-repeat=\"course in courses\"><div ng-include src=\"'static/partials/course/course_tile.html'\"></div></slide></carousel>"
  }
})
.directive('allCarousel', function() {
  return {
    restrict: 'E',
    template: "<carousel disable-animation=\"true\"><slide ng-repeat=\"course in courses\"><div ng-include src=\"'static/partials/course/course_tile.html'\"></div></slide></carousel>"
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
    template: "<table class=\"table\"><thead><tr><th>#</th><th>Username</th><th>First Name</th><th>Last Name</th><th>Ongoing Courses</th><th>Profile</th></tr><thead><tbody><tr ng-repeat=\"student in students\" ng-include src=\"'static/partials/student_row.html'\"></tr></tbody></table>"
  }
})
.directive('disableAnimation', function($animate){
    return {
        restrict: 'A',
        link: function($scope, $element, $attrs){
            $attrs.$observe('disableAnimation', function(value){
                $animate.enabled(!value, $element);
            });
        }
    }
});
;
