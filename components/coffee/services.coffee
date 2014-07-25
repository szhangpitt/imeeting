ServiceModule = angular.module('ServiceModule', [])

.service 'RoomService', ['$rootScope', ($rootScope) ->
    this.allRooms = `[
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
    ]`


    @availableRooms = () ->
        `[
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
        ]`
    
    $rootScope.allRooms = this.allRooms;

    @
]
