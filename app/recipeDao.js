var category = require('./category');
var mysql = require('mysql');

module.exports = new RecipeDao();

function RecipeDao() {
    
    var conn = mysql.createConnection({
        host : 'localhost',
        user : 'root',
        password : '',
        database : 'recipesdb001'
    });     
    
}

RecipeDao.prototype.getCategoryListFromDb = function(conn, callback) {
    var categoryList = new Map();
    var categoryQuery = 'select category_id, category_name from category';
    
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
    
};