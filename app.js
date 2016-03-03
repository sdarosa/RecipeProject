//*************** setup *************
var port = process.env.PORT || 8888;
var http = require('http');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql');

//mysql connection settings
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'sample_db'
});


require('./config/database.js')(connection);

//hosting config
http.createServer(function(req, res) {
    var pathName = url.parse(req.url).pathname;
    console.log('request for ' + pathName + ' received.');
    
    fs.readFile(pathName.substr(1), function(err, data) {
        if(err) {
            console.log(err);
            res.writeHead(404, {'Content-Type':'text/html'});
        } else {
            res.writeHead(200, {'Content-Type':'text/html'});
            res.write(data.toString());
        }
        res.end();
    });   
}).listen(port, "127.0.0.1");
console.log('server running at http://127.0.0.1:' + port);
