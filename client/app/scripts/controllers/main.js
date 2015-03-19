'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($scope) {
    $scope.scanned = '23,324';
    $scope.recovered = '306';
  })

  .controller('HeaderCtrl', function ($scope, $location) { 
    $scope.isActive = function (viewLocation) { 
      return viewLocation === $location.path();
    };
  });
