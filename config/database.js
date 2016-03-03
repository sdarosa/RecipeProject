// ************ setup *****************
var mysql = require('mysql');



module.exports = function(connection) {
    connection.connect(function(err) {
    if(err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
    });
    connection.query('select * from table1', function(err, results, fields) {
        if(err) {
            console.log('there was an error');
        }
        for(var i=0; i<results.length; i++) {
            console.log('id: ' + results[i].id + ' name: ' + results[i].name);
        }
    });
    connection.end();
}



