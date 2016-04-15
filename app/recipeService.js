var recipeDao = require('./recipeDao');
module.exports = new RecipeService();

function RecipeService() {    
    
}

RecipeService.prototype.getAllRecipeNames = function(callback) {
    recipeDao.getRecipeNames(function(recipeNames) {
        callback(recipeNames);
    });  
};

RecipeService.prototype.getAllRecipeData = function(callback) {
    recipeDao.getAllRecipes(function(recipesMap) {
        //convert recipes map to array of recipe objects
        var recipesArray = recipesMap.convertToArray(); 
        callback(recipesArray);
    });
};

RecipeService.prototype.addNewRecipe = function(recipeFormValues, callback) {
    var recipeTableValues = {
        title: recipeFormValues.title,
        image_path: recipeFormValues.image_path,
        directions: recipeFormValues.directions,
        prep_time: recipeFormValues.prep_time,
        cook_time: recipeFormValues.cook_time,
        serves: recipeFormValues.serves
    };    
    var ingredientsArray = recipeFormValues.ingredients;  
    var categoryIdsSelected = [];        
    for(var i=1; i<Object.keys(recipeFormValues.categoryIds).length + 1; i++) { 
        if(recipeFormValues.categoryIds[i] === 'on') {
            categoryIdsSelected.push(i);
        }
    }       
    recipeDao.saveNewRecipe(recipeTableValues, ingredientsArray, categoryIdsSelected, function(response) {
        callback(response);
    });
};

RecipeService.prototype.getCategoryList = function(callback) {    
    var categoryList;       
    recipeDao.getCategoryListFromDb(function(catList) { 
        categoryList = catList;        
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
        callback(recipeObject);
    });
};