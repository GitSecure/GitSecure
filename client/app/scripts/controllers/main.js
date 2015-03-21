'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($scope, $http, $interval) {
    $scope.scanned = 0;
    $scope.recovered = 0;

    $interval(function() {
      getNumbers();
    }, 3000);

    var getNumbers = function() {
      $http.get('http://localhost:3000/numbers').success(function(data){
        $scope.scanned = data.scanned;
        $scope.recovered = data.hits;
      })
    }
  })

  .controller('HeaderCtrl', function ($scope, $location) { 
    $scope.isActive = function (viewLocation) { 
      return viewLocation === $location.path();
    };
  });
