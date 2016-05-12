var recipeService = require('./recipeService');

module.exports = function(app) {
    
    app.post('/login', function(req, res) {
        console.log('from login route');
        console.log(req.body);
        recipeService.loginUser(req.body, function(err, user) {
            if(err) {
                console.log("Error trying to log in user");
                res.send('Error: wrong username or password');
            } else {
                req.session.user = user;
                console.log('user logged in successfully');
               // res.send('user logged in successfully: ' + user.id + ' name: ' + user.name);
                res.redirect('/#/dashboard');
            }            
        });
    });
    
    app.post('/signup', function(req, res) {
        console.log('from signup route');
        console.log(req.body);
        recipeService.insertNewUser(req.body, function(result) {
            res.json(result);
        });       
    });
    
    app.get('/admin', function(req, res) {
        if(req.session && req.session.user) {
            recipeService.findUser(req.session.user.email, function(found, user) {
                if(found) {
                    res.end('user is logged in');
                } else {
                    res.end('user is not logged in, redirect to login');
                }
            });
        } else {
            res.end('session doesnt exist, redirect to login');
        }
    });
    
    app.get('/user/dashboard', function(req, res) {
        console.log('session on /user/dashboard');
        console.log(req.session);        
        if(req.session && req.session.user) {   //check if session exists                    
            recipeService.findUser(req.session.user.email, function(found, user) {
                if(!found) {
                    console.log('Error: could not find user with email: ' + req.session.email);
                    //reset session
                    req.session.reset();
                    res.redirect('/login');
                } else {
                    console.log('hi from dashboard again');   
                    var userData = {
                        name: user.name,
                        email: user.email                       
                    };                 
                    recipeService.getRecipesFromUserId(user.id, function(recipes) {
                        if(recipes == null) {
                            res.json({ 
                                result: 'no recipes',
                                message: 'You have no recipes, just add some or create your own.', 
                                user: userData,
                                recipes: null 
                            });
                        } else {                            
                            res.json({ 
                                result: 'success',
                                message: 'Here are the recipes you created.', 
                                user: userData,
                                recipes: recipes 
                            });
                        }                       
                        res.end();
                    });
                }
            });
        } else {
            console.log('session is not defined, redirecting to login');
            res.json({ result: 'error', message: 'user needs to login', user: null, recipes: null });
        }
    });
    
    app.get('/logout', function(req, res) {
        console.log('hi from logout route');
        if(req.session && req.session.user) {
            //reset session
            req.session.reset();
            res.redirect('/');
        }
    });
    
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
        if(req.session && req.session.user) {
            var recipeTableValues = {
                user_id: req.session.user.id,
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
        } else {
            res.redirect('/#/login');
        }        
    });
    
    //application
    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/public/index.html');
    });
};

function isLoggedIn(req, res, next) {
    //if user is authenticated in the session, carry on
    if(req.isAuthenticated()) {
        return next();
    }
    //if they aren't, redirect them to the home page
    res.redirect('/');
}