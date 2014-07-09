appModule = angular.module('imeeting', ['ngRoute'])

roomDataController = ($scope) -> 
    $scope.rooms = `[
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

appModule.controller('roomDataController', roomDataController)

appModule.filter('dasherize', () -> 
    (input) -> 
        input.dasherize())

appModule.filter('orderize', () ->
    (input) ->
        if (input + '').endsWith('1')
            input + 'st'
        else if (input + '').endsWith('2')
            input + 'nd'
        else if (input + '').endsWith('3')
            input + 'rd'
        else
            input

        )