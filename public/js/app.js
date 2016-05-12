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
        })
        .when('/onerecipe/:id', {
            templateUrl: 'pages/onerecipe.html',
            controller: 'oneRecipeController'
        })
        .when('/login', {
            templateUrl: 'pages/login.html',
            controller: 'userLoginController'
        })
        .when('/signup', {
            templateUrl: 'pages/registration.html',
            controller: 'registrationController'
        })
        .when('/dashboard', {
            templateUrl: 'pages/dashboard.html',
            controller: 'dashboardController'
        })
        .otherwise({
            redirectTo: '/'
        });
});


//controllers

recipeApp.controller('menuController', ['$scope', function($scope) {
    
}]);

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

recipeApp.controller('oneRecipeController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {   
    $scope.recipeId = $routeParams.id || -1;
    $scope.data = {};
    $http.get('/api/recipe/' + $scope.recipeId)
        .success(function(data) {
            $scope.data = data;
        })
        .error(function(err) {
            console.log('Error trying to get one recipe with id: ' + $routeParams.id);
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

recipeApp.controller('userLoginController', ['$scope', function($scope) {
    
}]);

recipeApp.controller('registrationController', ['$scope', function($scope) {
    
}]);

recipeApp.controller('dashboardController', ['$scope', '$http', '$window', function($scope, $http, $window) {    
    $scope.data = {};
    $http.get('/user/dashboard')
        .success(function(data) {        
            if(data.result === "error") {
                console.log('error');
                $window.location.href = '/#/login';
            } else {
                $scope.data = data;
            }
        })
        .error(function(err) {
            console.log('Error trying to get recipes data from specified user');
        });
}]);