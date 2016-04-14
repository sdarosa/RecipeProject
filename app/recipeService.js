var category = require('./category');
var recipe = require('./recipe');
var mysql = require('mysql');
var recipeDao = require('./recipeDao');

module.exports = new RecipeService();

function RecipeService() {    
    
}



RecipeService.prototype.getCategoryList = function(callback) {    
    var categoryList;       
    recipeDao.getCategoryListFromDb(function(catList) { 
        categoryList = catList;
        //print it 
        // console.log('Category List from the Service:\n');
        // for(var value of categoryList.values()) {
        //     console.log(value);
        // }           
        //convert map to object
        var categories = [];
        categoryList.forEach(function(value, key) {
            var currentCategory = {
                categoryId: key,
                categoryName: value
            };
            categories.push(currentCategory);
        }, categoryList);   
        callback(categories);
    });        
};

RecipeService.prototype.getRecipeGivenId = function(id, callback) {
    var recipeId = id;
    recipeDao.getRecipeData(recipeId, function(recipeObject) {
        console.log('\n\nhi from ReicpeService');
        console.log('Recipe Object: ');
        recipeObject.printIt();
        callback(recipeObject);
    });
};