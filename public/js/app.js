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
        .when('/logout', {
            controller: 'logoutController'
        })
        .when('/dashboard', {
            templateUrl: 'pages/dashboard.html',
            controller: 'dashboardController'
        })
        .when('/reciperesult', {
            templateUrl: 'pages/reciperesult.html'
        })
        .otherwise({
            redirectTo: '/'
        });
});

//services
recipeApp.service('menuService', function() {
    var home = {
        href: '/',
        name: 'Home'
    };
    var allRecipes = {
        href: '#recipes',
        name: 'All Recipes'
    };    
    var login = {
        href: '#login',
        name: 'Login'
    };
    var signup = {
        href: '#signup',
        name: 'Sign Up'
    };
    var newRecipe = {
        href: '#newrecipe',
        name: 'New Recipe'
    };
    var userDashboard = {
        href: '#dashboard',
        name: 'My Recipes'
    };
    var logout = {
        href: '/logout',
        name: 'Logout'
    };        
    this.guestMenu = [home, allRecipes, login, signup];
    this.userMenu = [home, allRecipes, newRecipe, userDashboard, logout];    
});


recipeApp.factory('authenticationService', ['$q', '$timeout', '$http', function($q, $timeout, $http) {
    var user = null;    
    return ({
        isLoggedIn: isLoggedIn,
        getUserStatus: getUserStatus,
        login: login,
        logout: logout,
        register: register
    });    
    function isLoggedIn() {
        if(user) {
            return true;
        } else {
            return false;
        }
    }
    function getUserStatus() {
        return user;
    }
    function login(userEmail, userPassword) {
        var deferred = $q.defer();    
        $http.post('/login', {userEmail: userEmail, userPassword: userPassword})
            .success(function(data, status) {
                if(status === 200 && data.status) {
                    user = true;
                    deferred.resolve();
                } else {
                    user = false;
                    deferred.reject();
                }
            })
            .error(function(err) {
                user = false;
                deferred.reject();
            });        
            //return promise object
            return deferred.promise;
    }
    function logout() {
        var deferred = $q.defer();
        $http.get('/logout')
            .success(function(data) {
                user = false;
                deferred.resolve();
            })
            .error(function(err) {
                user = false;
                deferred.reject();
            });
            return deferred.promise;
    }
    function register(userName, userEmail, userPassword) {
        var deferred = $q.defer();
        $http.post('/signup', {userName: userName, userEmail: userEmail, userPassword: userPassword})
            .success(function(data, status) {
                if(status === 200 && data.status) {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            })
            .error(function(err) {
                deferred.reject();
            });
            return deferred.promise;
    }
}]);

//controllers
recipeApp.controller('menuController', ['menuService', '$scope', '$http', function(menuService, $scope, $http) {  
    $http.get('/admin')
        .success(function(data) {
            if(data === 'guest') {
                $scope.menu = menuService.guestMenu;
            } else {
                $scope.menu = menuService.userMenu;
            }            
        })
        .error(function(err) {
            console.log('error trying to get user type from admin');        
        });
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
}]);

recipeApp.controller('userLoginController', ['$scope', '$window', 'authenticationService', function($scope, $window, authenticationService) {
    $scope.login = function() {
        //initial values
        $scope.error = false;  
        
        //call login from service
        authenticationService.login($scope.loginForm.userEmail, $scope.loginForm.userPassword)
            .then(function() {
                $window.location.href = '/';
                $scope.loginForm = {}; //reset login info
                
            })
            .catch(function() {
                $scope.error = true;
                $scope.errorMessage = "Wrong username and/or password, please try again";
                $scope.loginForm = {};
            });
    };
}]);

recipeApp.controller('logoutController', ['$scope', '$window', 'authenticationService', function($scope, $window, authenticationService) {
    $scope.logout = function() {
        authenticationService.logout()
            .then(function() {                
                $window.location.href = '/login';                
            });
    };
}]);

recipeApp.controller('registrationController', ['$scope', function($scope) {
    
}]);

recipeApp.controller('dashboardController', ['$scope', '$http', '$window', function($scope, $http, $window) {    
    $scope.data = {};
    $http.get('/user/dashboard')
        .success(function(data) {        
            if(data.result === "error") {
                console.log('error trying to login');
                $window.location.href = '/#/login';
            } else {
                $scope.data = data;
            }
        })
        .error(function(err) {
            console.log('Error trying to get recipes data from specified user');
        });
}]);