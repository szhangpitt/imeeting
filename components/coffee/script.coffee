
appModule.controller 'roomDataController', ['$scope', ($scope) -> 
      
]

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