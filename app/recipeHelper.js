var Recipe = require('./recipe');

module.exports = RecipeHelper;

function RecipeHelper() {
    this.recipeMap = new Map();
}

RecipeHelper.prototype.addNewRecipe = function(r) {
    this.recipeMap.set(r.recipeId, new Recipe(r.id, r.title, r.imagePath, r.directions, r.prepTime, r.cookTime, r.serves));
    //add ingredient & category
    this.recipeMap.get(r.recipeId).addIngredient(r.ingredientId, r.ingredient);
    this.recipeMap.get(r.recipeId).addCategory(r.categoryId, r.category);    
}

//subcategory = ingredients, categories
RecipeHelper.prototype.updateRecipe = function(recipeId, subcategory, subcategoryId, subcategoryValue) {
    if(subcategory === "ingredients") {
        if(this.recipeMap.get(recipeId).ingredients.get(subcategoryId) == null) {
            this.recipeMap.get(recipeId).ingredients.set(subcategoryId, subcategoryValue);
        } 
    } else if(subcategory == "categories") {
        if(this.recipeMap.get(recipeId).categories.get(subcategoryId) == null) {
            this.recipeMap.get(recipeId).categories.set(subcategoryId, subcategoryValue);
        } 
    }    
}

RecipeHelper.prototype.updateMap = function(r) {
    //if new recipe, then add it to the map
    if(this.recipeMap.get(r.recipeId) == null) {
        this.addNewRecipe(r);
    } else {
        //update current ingredient and/or category to existing recipe
        this.updateRecipe(r.recipeId, "ingredients", r.ingredientId, r.ingredient);
        this.updateRecipe(r.recipeId, "categories", r.categoryId, r.category);
    }
}

RecipeHelper.prototype.convertToArray = function() {
    var recipes = [];
    
    for(var key of this.recipeMap.keys()) {        
        var myRecipe = {
            id: key,
            title: this.recipeMap.get(key).title,
            imagePath: this.recipeMap.get(key).imagePath,
            directions: this.recipeMap.get(key).directions,
            prepTime: this.recipeMap.get(key).prepTime,
            cookTime: this.recipeMap.get(key).cookTime,
            serves: this.recipeMap.get(key).serves,
            ingredients: [],
            categories: []
        };
        //add ingredients to ingredients array
        for(var ingredientsKey of this.recipeMap.get(key).ingredients.keys()) {
            myRecipe.ingredients.push(this.recipeMap.get(key).ingredients.get(ingredientsKey));
        }
        //add categories to categories array
        for(var categoriesKey of this.recipeMap.get(key).categories.keys()) {
            myRecipe.categories.push(this.recipeMap.get(key).categories.get(categoriesKey));
        }
        recipes.push(myRecipe);
    }
    return recipes;
}
