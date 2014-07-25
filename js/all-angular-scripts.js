var appModule;

appModule = angular.module('appModule', ['ngRoute', 'ControllersModule']);

appModule.config([
  '$routeProvider', function($routeProvider) {
    return $routeProvider.when('/', {
      controller: 'HomeController',
      templateUrl: 'partials/home.html'
    }).when('/rooms', {
      templateUrl: 'partials/rooms.html'
    }).when('/now', {
      templateUrl: 'partials/now.html'
    }).when('/book', {
      templateUrl: 'partials/book.html'
    }).otherwise({
      templateUrl: '/'
    });
  }
]);

var ControllersModule;

ControllersModule = angular.module('ControllersModule', ['ServiceModule'], function() {});

ControllersModule.controller('HomeController', [
  '$scope', function($scope) {
    $scope.title = 'Home';
    return $scope.options = ['My Room', 'Book a Room', 'Rooms Now'];
  }
]).controller('RoomListController', [
  '$scope', 'RoomService', function($scope, RoomListService) {
    $scope.title = 'Room List';
    $scope.tabOptions = ['Upcoming', 'Past'];
    $scope.rooms = RoomListService.allRooms;
    $scope.roomsOrderBy = function(prop) {
      return $scope.rooms.sort(function(a, b) {
        if (a[prop] < b[prop]) {
          return -1;
        } else {
          return 1;
        }
      });
    };
    $scope.roomsOrderBy('capacity');
    $scope.roomCapacityFilter = function(size) {
      return function(room) {
        if (!size) {
          return true;
        } else if (size === 'small') {
          return room.capacity < 10;
        } else if (size === 'large') {
          return room.capacity >= 10;
        } else if (size === 'all') {
          return true;
        }
      };
    };
    return this;
  }
]).controller('RoomDetailController', [
  '$scope', function($scope) {
    return $scope.room = 'Executive Conference Room';
  }
]);

appModule.controller('roomDataController', ['$scope', function($scope) {}]);

appModule.filter('dasherize', function() {
  return function(input) {
    return input.dasherize();
  };
});

appModule.filter('orderize', function() {
  return function(input) {
    if ((input + '').endsWith('1')) {
      return input + 'st';
    } else if ((input + '').endsWith('2')) {
      return input + 'nd';
    } else if ((input + '').endsWith('3')) {
      return input + 'rd';
    } else {
      return input;
    }
  };
});

var ServiceModule;

ServiceModule = angular.module('ServiceModule', []).service('RoomService', [
  '$rootScope', function($rootScope) {
    this.allRooms = [
    {
      name: 'Weyrich',
      floor: 2,
      capacity: 30
    }, {
      name: 'Executive',
      floor: 1,
      capacity: 50
    }, {
      name: 'AC',
      floor: 2,
      capacity: 20
    }, {
      name: 'ADS',
      floor: 2,
      capacity: 10
    }, {
      name: 'General',
      floor: 1,
      capacity: 200
    }, {
      name: 'Ad hoc 1',
      floor: 1,
      capacity: 5
    }, {
      name: 'Ad hoc 2',
      floor: 1,
      capacity: 5
    }
    ];
    this.availableRooms = function() {
      return [
        {
          name: 'ADS',
          floor: 2,
          capacity: 10
        }, {
          name: 'General',
          floor: 1,
          capacity: 200
        }, {
          name: 'Ad hoc 1',
          floor: 1,
          capacity: 5
        }, {
          name: 'Ad hoc 2',
          floor: 1,
          capacity: 5
        }
        ];
    };
    $rootScope.allRooms = this.allRooms;
    return this;
  }
]);
