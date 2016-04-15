var recipeService = require('./recipeService');

module.exports = function(app) {
    
    app.get('/api/allrecipenames', function(req, res) {          
        recipeService.getAllRecipeNames(function(data) {
            res.json(data);
        });
    });
    
    app.get('/api/categoryList', function(req, res) {       
       recipeService.getCategoryList(function(data) {
           res.json(data);
       });   
    });
    
    app.get('/api/recipe/:id', function(req,res) {
        var id = req.params.id;        
        recipeService.getRecipeGivenId(id, function(data) {           
            var recipeObject = data.convertToObjectWithArrays();
            res.json(recipeObject);            
        });
    });
    
    app.get('/api/allrecipedata', function(req, res) {  
        recipeService.getAllRecipeData(function(data) {            
            res.json(data);
        });
    });
    
    //add new recipe to db 
    app.post('/api/newrecipe', function(req, res) {  
        var recipeTableValues = {
            title: req.body.title,
            image_path: 'images/' + req.file.filename,   
            directions: req.body.directions.trim(),
            prep_time: req.body.preptime,
            cook_time: req.body.cooktime,
            serves: req.body.serves,
            ingredients: req.body.ingredients.trim().split("\r\n"),
            categoryIds: {
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
            }
        };               
        recipeService.addNewRecipe(recipeTableValues, function(savedToDb) {            
            if(savedToDb) {
                res.end('Successfully saved recipe to db');
            } else {
                res.end('Error: Could not save to db');
            }
        });
    });
    
    //application
    app.get('*', function(req, res) {
        res.sendFile(__dirname + '/public/index.html');
    });
};