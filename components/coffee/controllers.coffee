# Controllers Module
#
# @abstract All controllers goes in this module...
#
ControllersModule = angular.module 'ControllersModule', ['ServiceModule'], () ->
    # configuration handler

ControllersModule
.controller 'HomeController', ['$scope', ($scope) -> 
    $scope.title = 'Home'
    $scope.options = ['My Room', 'Book a Room', 'Rooms Now']
]

.controller 'RoomListController', ['$scope', 'RoomService', ($scope, RoomListService) -> 
    $scope.title = 'Room List'
    $scope.tabOptions = ['Upcoming', 'Past']
    $scope.rooms = RoomListService.allRooms

    $scope.roomsOrderBy = (prop) -> 
        $scope.rooms.sort (a, b) -> 
            if a[prop] < b[prop] then -1
            else 1

    $scope.roomsOrderBy('capacity')

    $scope.roomCapacityFilter = (size) ->
        (room) ->
            if !size then true
            else if size == 'small' then room.capacity < 10 
            else if size == 'large' then room.capacity >= 10
            else if size == 'all' then true
            
    @
]

.controller 'RoomDetailController', ['$scope', ($scope) ->
    $scope.room = 'Executive Conference Room'
]