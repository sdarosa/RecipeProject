
module.exports = Recipe;

function Recipe(title, imagePath, directions, prepTime, cookTime, serves) {   
    this.title = title;
    this.imagePath = imagePath;
    this.directions = directions;
    this.prepTime = prepTime;
    this.cookTime = cookTime;
    this.serves = serves;  
    this.ingredients = new Map();
    this.categories = new Map();   
}

Recipe.prototype.addIngredient = function (ingredientId, ingredient) {
    this.ingredients.set(ingredientId, ingredient);
};
Recipe.prototype.addCategory = function (categoryId, category) {
    this.categories.set(categoryId, category);
};