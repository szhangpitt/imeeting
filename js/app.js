var appModule;

appModule = angular.module('appModule', ['ngRoute', 'ControllersModule']);

appModule.config([
  '$routeProvider', function($routeProvider) {
    return $routeProvider.when('/', {
      templateUrl: 'partials/home.html'
    }).when('/rooms', {
      templateUrl: 'partials/rooms.html'
    }).when('/now', {
      templateUrl: 'partials/now.html'
    }).otherwise({
      templateUrl: '/'
    });
  }
]);
