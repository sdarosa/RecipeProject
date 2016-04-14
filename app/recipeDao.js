var category = require('./category');
var mysql = require('mysql');
var Recipe = require('./recipe');
var Q = require('q');   //promise module

module.exports = new RecipeDao();

var connectionSettings = {
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'recipesdb001'
};

function RecipeDao() {    
    
}


RecipeDao.prototype.getCategoryListFromDb = function(callback) {
    var conn = mysql.createConnection(connectionSettings);     
    var categoryList = new Map();
    var categoryQuery = 'select category_id, category_name from category';
    conn.connect();
    conn.query(categoryQuery, function(err, rows) {
        if(err) {
            console.log("there was an error trying to execute a query: " + err);
        }
        for(var i=0; i<rows.length; i++) {
            var categoryId = rows[i].category_id;
            var categoryName = rows[i].category_name;
            categoryList.set(categoryId, categoryName);
        }   
        callback(categoryList);        
    });     
    conn.end();
};

//returns a recipe object given a recipe id
RecipeDao.prototype.getRecipeData = function(id, callback) {
    var recipeId = id;
    var conn = mysql.createConnection(connectionSettings); 
  
    var query1 = function() {
        var p = Q.defer();
        var q1 = 'SELECT title, image_path, directions, prep_time, cook_time, serves FROM recipe where recipe_id = ?';        
        conn.query(q1, [recipeId], function(err, row) {
            if(err) {
                console.log("There was an error trying to get recipe data with recipeId: " + recipeId + ". Error: " + err);                
            } 
            if(row.length > 0) {
                var title = row[0].title;
                var imagePath = row[0].image_path;
                var directions = row[0].directions;
                var prepTime = row[0].prep_time;
                var cookTime = row[0].cook_time;
                var serves = row[0].serves;
                recipeObject = new Recipe(recipeId, title, imagePath, directions, prepTime, cookTime, serves);
                p.resolve(recipeObject);
            } else {
                p.reject("There was a problem trying to get recipe with given id");
            }           
        });        
        return p.promise;       
    };
    
    var query2 = function(recipeObject) {
        var p = Q.defer();       
        var q2 = 'SELECT ingredient_id, item FROM ingredient WHERE recipe_id = ? ORDER BY ingredient_id ASC';        
        conn.query(q2, [recipeId], function(err, rows) {
            if(err) {
                console.log('Error trying to get ingredients from recipe id ' + recipeId);
            }
            for(var i=0; i<rows.length; i++) {
                var ingredientId = rows[i].ingredient_id;
                var item = rows[i].item;
                //console.log('ingredients: ' + item);
                recipeObject.addIngredient(ingredientId, item);
            }
            //console.log('From query 2');
            //recipeObject.printIt();            
            p.resolve(recipeObject);
        });   
        return p.promise;
    };
    
    var query3 = function(recipeObject) {
        var p = Q.defer();       
        var q3 = "SELECT rc.category_id, c.category_name " +
                 "FROM recipe_category rc " +
                 "	JOIN category c ON rc.category_id = c.category_id " +
                 "WHERE rc.recipe_id = ? " +
                 "ORDER BY c.category_id ASC";
              
        conn.query(q3, [recipeId], function(err, rows) {
            if(err) {
                console.log('Error trying to get categories from recipe id ' + recipeId);
            }
            for(var i=0; i<rows.length; i++) {
                var categoryId = rows[i].category_id;
                var name = rows[i].category_name;
                //console.log('categories: ' + name);
                recipeObject.addCategory(categoryId, name);
            }
            console.log('From query 3:');
            //recipeObject.printIt();
            p.resolve(recipeObject);
        });   
        return p.promise;
    };
    
    var getFinalObject = function(recipeObject) {       
        //console.log("hi from getFinalObject in recipeDao");
        //recipeObject.printIt();
        callback(recipeObject);
    };    
    query1().then(query2).then(query3).then(getFinalObject);      
};