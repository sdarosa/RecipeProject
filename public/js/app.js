var recipeApp = angular.module("recipeApp", ['ngRoute']);

//config
recipeApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'pages/main.html',
            controller : 'mainController'
        })
        .when('/recipes', {
            templateUrl :'pages/allrecipes.html',
            controller : 'allRecipesController'
        });
});


//controllers
recipeApp.controller('mainController', ['$scope', '$http', function($scope, $http) {
    $scope.data = {};
    
    $http.get('api/allrecipenames')
        .success(function(data) {
            $scope.data = data;
        })
        .error(function(err) {
            console.log('Error trying to retrieve all recipe titles: ' + err);
        });    
}]);

recipeApp.controller('allRecipesController', ['$scope', '$http', function($scope, $http) {
    $scope.data = {};
    
    $http.get('api/allrecipedata')
        .success(function(data) {
            $scope.data = data;
        })
        .error(function(err) {
            console.log('Error trying to retrieve all recipe data: ' + err);
        });
}]);


