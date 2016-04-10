var category = require('./category');
var recipe = require('./recipe');
var mysql = require('mysql');
var recipeDao = require('./recipeDao');

module.exports = new RecipeService();

function RecipeService() {
    
    
}



RecipeService.prototype.getCategoryList = function(callback) {
    var conn = mysql.createConnection({
        host : 'localhost',
        user : 'root',
        password : '',
        database : 'recipesdb001'
    });     
    var categoryList;   
    
    recipeDao.getCategoryListFromDb(conn, function(catList) { 
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
        return;
    });        
};