appModule = angular.module 'appModule', ['ngRoute', 'ControllersModule']

appModule.config ['$routeProvider', ($routeProvider) ->
	$routeProvider.when '/', {
		controller: 'HomeController',
		templateUrl: 'partials/home.html'
	}
	.when '/rooms', {
		templateUrl: 'partials/rooms.html'
	}	
	.when '/now', {
		templateUrl: 'partials/now.html'
	}
	.when '/book', {
		templateUrl: 'partials/book.html'
	}
	.otherwise {
		templateUrl: '/'
	}
]