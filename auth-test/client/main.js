'use strict';

angular.module('GitSecure', [
  'GitSecure.AuthController',
  'GitSecure.mainController',
  'ui.router'

]).config(function($stateProvider, $urlRouterProvider) {

  // Now set up the states
  $stateProvider
    .state('signup', {
      url: '/signup',
      templateUrl: 'signup/signup.html',
      controller: 'AuthController',
    })
    .state('login', {
      url: '/login',
      templateUrl: 'login/login.html',
      controller: 'AuthController'
    })
    .state('main', {
      url: '/',
      templateUrl: 'main.html',
      controller: 'mainController',
      data: {
        requireLogin: true
      }
    })  

}).run(function ($rootScope) {

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    var requireLogin = toState.data.requireLogin;

    if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
      event.preventDefault();
      // get me a login modal!
    }
  });

});