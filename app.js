//*************** setup *************
var port = process.env.PORT || 3000;
var http = require('http');
var fs = require('fs');
var url = require('url');
var express = require('express');
var app = express();

//static files
app.use(express.static(__dirname + '/public'));

//routes
require('./app/routes.js')(app);

//server
app.listen(port);
console.log('app listening on port: ' + port);