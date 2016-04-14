
module.exports = Recipe;

//helper function: prints a map
function printMap(myMap) {
    if(myMap.size > 0) {        
        myMap.forEach(function (value, key, map) {
            console.log('m [' + key + '] -> ' + value);
        });
    } else {
        console.log('Map is empty');
    }
}

function convertMapValuesToArray(myMap) {
    var valueArray = [];
    if(myMap.size > 0) {
        myMap.forEach(function (value, key, map) {
            valueArray.push(value);
        });
    }
    return valueArray;
}

function Recipe(id, title, imagePath, directions, prepTime, cookTime, serves) {   
    this.id = id;
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

Recipe.prototype.printIt = function() {
    console.log('Recipe Id: ' + this.id);
    console.log('title: ' + this.title);
    console.log('Image path: ' + this.imagePath);
    console.log('Directions: ' + this.directions);
    console.log('Prep time: ' + this.prepTime);
    console.log('Cook time: ' + this.cookTime);
    console.log('Servings: ' + this.serves);
    console.log('Ingredients:');
    printMap(this.ingredients);
    console.log('Categories:');
    printMap(this.categories);
};

Recipe.prototype.convertToObjectWithArrays = function() {    
    var recipeObject = {
        title: this.title,
        imagePath: this.imagePath,
        directions: this.directions,
        prepTime: this.prepTime,
        cookTime: this.cookTime,
        serves: this.serves,
        ingredients: [],
        categories: []
    };  
    recipeObject.ingredients = convertMapValuesToArray(this.ingredients);
    recipeObject.categories = convertMapValuesToArray(this.categories);
    return recipeObject;
};

