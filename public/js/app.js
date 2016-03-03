var recipeApp = angular.module("recipeApp", ['ngRoute']);

//config
recipeApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'pages/main.html',
            controller : 'mainController'
        })
        .when('/recipes', {
            templateUrl : 'pages/allrecipes.html',
            controller : 'allRecipesController'
        });
});

//services
recipeApp.service('recipeData', function() {
    this.data = JSON.parse(convertToJson());
});


//controllers
recipeApp.controller('mainController', ['$scope', 'recipeData', function($scope, recipeData) {
    $scope.data =  recipeData.data; 
    
    
}]);

recipeApp.controller('allRecipesController', ['$scope', 'recipeData', function($scope, recipeData) {
    $scope.data = recipeData.data;    
}]);


