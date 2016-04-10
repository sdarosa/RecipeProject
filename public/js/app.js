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
        })
        .when('/newrecipe', {
            templateUrl: 'pages/newrecipe.html',
            controller: 'newRecipeController'
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
    
    $http.get('/api/allrecipedata')
        .success(function(data) {
            $scope.data = data;
        })
        .error(function(err) {
            console.log('Error trying to retrieve all recipe data: ' + err);
        });
}]);

recipeApp.controller('newRecipeController', ['$scope', '$http', function($scope, $http) { 
    $scope.categoryData = {};
    //get category data to populate the category section of the new recipe form
    $http.get('/api/categoryList')
        .success(function(categoryData) {
            $scope.categoryData = categoryData;
        })
        .error(function(err) {
            console.log('Error trying to get category data into new recipe form: ' + err);
        });
    
    
    // $scope.formData = {};
    // Object.keys($scope.formData).forEach(function(key) {
    //     $scope.formData.append(key, $scope.formData[key]);
    // });    
    // //create a new recipe & add it to db
    // $scope.createNewRecipe = function() {
    //     $http.post('/api/newrecipe', $scope.formData)        
    //        .success(function(data) {
    //             console.log('posted successfully.');
    //             console.log($scope.formData);
    //        })
    //        .error(function(err) {
    //             console.log('Error: ' + err);
    //           });
    // };  
}]);




