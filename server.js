//
// server.js
//
var http = require('http');
var express = require('express');
var logger = require('morgan');
var routes_v1 = require('./api/routes_v1');
var routes_v2 = require('./api/routes_v2');
var config = require('./config/config');
var db = require('./config/db');

var app = express();
var port = process.env.PORT || config.webPort;

// Installeer Morgan als logger
app.use(logger('dev'));

app.use('/api/v1', routes_v1);
app.use('/api/v2', routes_v2);

// Fallback - als geen enkele andere route slaagt wordt deze uitgevoerd. 
app.use('*', function(req, res){
	res.status(400);
	res.json({
		'error' : 'Deze URL is niet beschikbaar.'
	});
});

app.listen(port, function(){
	console.log('De server luistert op port ' + port);	
});

module.exports = app;
