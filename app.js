﻿var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
var port = process.env.PORT || 8080; 

app.set('views', path.join(__dirname, 'views'));
app.engine('htm', require('uinexpress').__express); // underscore template for .htm
app.set('view engine', 'htm');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

var router = express.Router();
router.get('/', function(req, res){         
    res.render('index.htm',{
		layout: 'layout.htm'
	});
});

app.use('/', router);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error.htm', {
            message: err.message,
            error: err,
			layout: 'layout.htm'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.htm', {
        message: err.message,
        error: {},
		layout: 'layout.htm'
    });
});

app.listen(port);
console.log('Start on post:' + port);
