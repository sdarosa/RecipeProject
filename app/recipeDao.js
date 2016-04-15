var mysql = require('mysql');
var Recipe = require('./recipe');
var RecipeHelper = require('./recipeHelper');
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

RecipeDao.prototype.getRecipeNames = function(callback) {
    var conn = mysql.createConnection(connectionSettings); 
    var q = 'select recipe_id, title from recipe';
    var recipeIdsNames = [];    
    conn.query(q, function(err, rows) {
        if(err) {
            console.log("there was an error trying to execute a query: " + err);            
        }  
        for(var i=0; i<rows.length; i++) {
            var currentRecipeIdName = {
                recipe_id: rows[i].recipe_id,
                title: rows[i].title
            };
            recipeIdsNames.push(currentRecipeIdName);
        }
        callback(recipeIdsNames);      
    });    
};

RecipeDao.prototype.saveNewRecipe = function(recipeTableValues, ingredients, categoryIdsSelected, callback) {
    var conn = mysql.createConnection(connectionSettings); 
    
    var query1 = function() {
        var recipeQuery = "INSERT INTO recipe SET ?";  
        var d = Q.defer();
        conn.query(recipeQuery, recipeTableValues, function(err, result) {
            if(err) {
                console.log("Error adding recipe to db: " + err);
            }               
            console.log('Success inserting new recipe with ID: ' + result.insertId);
            d.resolve(result.insertId);
        });
        return d.promise;
    };        
    var query2 = function(recipeId) { 
        var ingredientQuery = "INSERT INTO ingredient SET ?";           
        for(var i=0; i<ingredients.length; i++) {
            var ingredientTableValues = {
                recipe_id: recipeId,
                item: ingredients[i]
            };     
            conn.query(ingredientQuery, ingredientTableValues, function(err, result) {
                if(err) {
                    console.log("Error adding ingredient to db: " + err);
                }   
                console.log('Success inserting new ingredient with ID: ' + result.insertId);
            });
        }  
        return recipeId;
    };        
    var query3 = function(recipeId) {
        var q = 'INSERT INTO recipe_category SET ?';  
        for(var i=0; i< categoryIdsSelected.length; i++) {               
            var categoryRecipeTable = {
                recipe_id: recipeId,
                category_id: categoryIdsSelected[i]
            };
            conn.query(q, categoryRecipeTable, function(err, result) {
                if(err) {
                    console.log('Error adding category into recipe_category table: ' + err);
                }
                console.log('success inserting values into recipe_category table');
            });
        }
        return recipeId;        
    };    
    
    var result = function(recipeId) {
        var r = true;
        if(recipeId == null) {
            r = false;
        }
        callback(r);
    }       
    query1().then(query2).then(query3).then(result);   
};

RecipeDao.prototype.getAllRecipes = function(callback) {
    var q = "select i.recipe_id, i.ingredient_id, c.category_id, r.title, r.image_path, r.directions, r.prep_time, r.cook_time, r.serves,  i.item, c.category_name " +
                "from recipe r " +
                "join ingredient i on r.recipe_id = i.recipe_id " +
                "join recipe_category rc on rc.recipe_id = r.recipe_id " +
                "join category c on c.category_id = rc.category_id " +
                "order by i.recipe_id, i.ingredient_id, c.category_id asc";        
    var conn = mysql.createConnection(connectionSettings);  
    conn.connect();               
    conn.query(q, function(err, rows) {
        if(err) {
            console.log("There was an error trying to execute a query: " + err);
            return;
        }    
        var myRecipeMap = new RecipeHelper();                    
        for(var i=0; i<rows.length; i++) { 
            var currentRecipeRow = {
                recipeId: rows[i].recipe_id,
                ingredientId: rows[i].ingredient_id,
                categoryId: rows[i].category_id, 
                title: rows[i].title,
                imagePath: rows[i].image_path,
                directions: rows[i].directions,
                prepTime: rows[i].prep_time,
                cookTime: rows[i].cook_time,
                serves: rows[i].serves,
                ingredient: rows[i].item,
                category: rows[i].category_name     
            };
            myRecipeMap.updateMap(currentRecipeRow);                           
        } 
        callback(myRecipeMap);
    });  
    conn.end();         
};

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
                recipeObject.addIngredient(ingredientId, item);
            }  
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
                recipeObject.addCategory(categoryId, name);
            }
            p.resolve(recipeObject);
        });   
        return p.promise;
    };
    
    var getFinalObject = function(recipeObject) {  
        callback(recipeObject);
    };   
    query1().then(query2).then(query3).then(getFinalObject);  
};