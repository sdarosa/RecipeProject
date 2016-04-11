//connect to db
var mysql = require('mysql');
var RecipeHelper = require('./recipeHelper');
var Q = require('q'); //promise module
var recipeService = require('./recipeService');

var conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'recipesdb001'
});     

module.exports = function(app) {
    
    app.get('/api/allrecipenames', function(req, res) {       
        conn.query('select title from recipe', function(err, rows) {
           if(err) {
               console.log("there was an error trying to execute a query: " + err);
               return;
           }    
           res.json(rows);
        });        
    });
    
    app.get('/api/categoryList', function(req, res) {       
       recipeService.getCategoryList(function(data) {
           res.json(data);
       });   
    });
    
    app.get('/api/allrecipedata', function(req, res) {
        
        var q = "select i.recipe_id, i.ingredient_id, c.category_id, r.title, r.image_path, r.directions, r.prep_time, r.cook_time, r.serves,  i.item, c.category_name " +
                "from recipe r " +
                "join ingredient i on r.recipe_id = i.recipe_id " +
                "join recipe_category rc on rc.recipe_id = r.recipe_id " +
                "join category c on c.category_id = rc.category_id " +
                "order by i.recipe_id, i.ingredient_id, c.category_id asc";        
                        
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
            //convert map to array
            var recipes = myRecipeMap.convertToArray(); 
            res.json(recipes); 
        }); 
    });
    
    //add new recipe to db 
    app.post('/api/newrecipe', function(req, res) {         
        var recipeQuery = "INSERT INTO recipe SET ?";  
        var ingredientQuery = "INSERT INTO ingredient SET ?";  
        
        var recipeTableValues = {
            title: req.body.title,
            image_path: 'images/' + req.file.filename,   
            directions: req.body.directions.trim(),
            prep_time: req.body.preptime,
            cook_time: req.body.cooktime,
            serves: req.body.serves
        };        
        var ingredients = req.body.ingredients.trim().split("\r\n");    
        
        var categoryIds = {
            1: req.body.category1 || 'off',
            2: req.body.category2 || 'off',
            3: req.body.category3 || 'off',
            4: req.body.category4 || 'off',
            5: req.body.category5 || 'off',
            6: req.body.category6 || 'off',
            7: req.body.category7 || 'off',
            8: req.body.category8 || 'off',
            9: req.body.category9 || 'off',
            10: req.body.category10 || 'off',
            11: req.body.category11 || 'off',
            12: req.body.category12 || 'off',            
            13: req.body.category13 || 'off',
            14: req.body.category14 || 'off'                   
        };   
        var categoryIdsSelected = [];        
        for(var i=1; i<Object.keys(categoryIds).length + 1; i++) {           
            if(categoryIds[i] === 'on') {
                categoryIdsSelected.push(i);
            }
        }       
        //when you pass methods to other functions, you need to bind them first
        var query1 = function() {
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
        };        
        query1().then(query2).then(query3);       
        res.send('OK');
        res.end();        
    });
    
    //application
    app.get('*', function(req, res) {
        res.sendFile(__dirname + '/public/index.html');
    });
};