'use strict';

angular.module('GitSecure', [
  'main',
  'ui.router',
  'ngRoute'
])

// Begin App Configuration

.config(function($stateProvider, $httpProvider){
  
  // Register HTTP intercepter as an 'anonymous factory.'
  // HTTP interceptors intercept all requests for
  // authentication purposes

  $httpProvider.interceptors.push(function($q, $location) {
    return {
      response: function(response) {
        return response;
      },
      responseError: function(response) {
        if (response.status === 401)
          $location.url('/login');
        return $q.reject(response);
      }
    };
  });

  // Authorize is an utility function that checks if the user
  // has been authenticated. The function gets called on the
  // 'main' state's resolution (on 'resolve')

  var authorize = function($q, $timeout, $http, $location, $rootScope) {
    var deferred = $q.defer();

    $http.get('/loggedin').success(function(user){
      if (user !== 'unauthorized') {
        deferred.resolve();
      } else { 
        deferred.reject(); 
        $location.url('/login');
      } 
    });
    return deferred.promise;
  };

  // Setup up App states. "main" requires login and goes
  // through an authorization check each time

  $stateProvider
    .state('login', {
      url: '/',
      templateUrl: 'login.html',
      controller: 'mainController'
    })  
    .state('main', {
      url: '/main',
      templateUrl: 'main.html',
      controller: 'mainController',
      data: {requireLogin: true},
      resolve: {check: authorize}
    })  

})

// Begin the'run block,' where code gets executed after the 
// injector is created and is used to kickstart the application

.run(function ($rootScope, $state, $injector, $http) {

  // If authorized, then redirect to main state

  if (!$rootScope.isAuth){
    $state.go('main');
  }

  // Get Auth Data from server, if authorized then go 
  // to main state; otherwise, redirect to login

  $http.get('/loggedin')
    .success(function(data, status, headers, config) {
      if (data === 'unauthorized'){
        $state.go('login');
      } else {
        $rootScope.isAuth = true;
        $state.go('main');
      }
    }).
    error(function(data, status, headers, config) {
    });

  // State Change Listener
  // if user goes to a route that requires login and
  // is not authorized, then redirect to login

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    var requireLogin = toState.hasOwnProperty('data') ? toState.datarequireLogin : null;
    if (requireLogin && !$rootScope.isAuth) {
      event.preventDefault();
      $state.go('login');
    }
  });
});