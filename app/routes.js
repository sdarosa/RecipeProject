//connect to db
var mysql = require('mysql');

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
    
    app.get('/api/allrecipedata', function(req, res) {
        conn.query('select * from recipe', function(err, rows) {
            if(err) {
                console.log("There was an error trying to execute a query: " + err);
                return;
            }
            res.json(rows);
        });
    });
    
    
    //application
    app.get('*', function(req, res) {
        res.sendFile(__dirname + '/public/index.html');
    });
};