//*************** setup *************
var port = process.env.PORT || 3000;
var http = require('http');
var fs = require('fs');
var url = require('url');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override'); //lets you use HTTP verbs like PUT or DELETE where the client doesn't support it
var multer = require('multer');
var path = require('path');
var crypto = require('crypto');
var mime = require('mime');
var session = require('client-sessions'); //for encrypted client-side sessions

//static files
app.use(express.static(__dirname + '/public'));

//body parser for the post requests
app.use(bodyParser.json()); //for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); //for parsing application/x-www-form-urlencoded
app.use(methodOverride()); 

var multerStorage = multer.diskStorage({
    destination: './public/images',
    filename: function(req, file, cb) {
        crypto.pseudoRandomBytes(16, function(err, raw) {
            if(err) return cb(err);
            cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
            //cb(null, file.originalname);
        });
        //cb(null, file.fieldname + '_' + Date.now());
    }
});

app.use(multer({ storage: multerStorage }).single('userphoto'));

//session
app.use(session({
    cookieName: 'session',
    secret: 'randomstringgoeshere',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
}));


//app.use(session({ secret: 'thisisasessionsecretmessage', resave: false, saveUninitialized: false, cookie: {secure: true}}));

//routes
require('./app/routes.js')(app);

//server
app.listen(port);
console.log('app listening on port: ' + port);