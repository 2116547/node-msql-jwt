//
// ./api/routes_v2.js
//
var express = require('express');
var routes = express.Router();
var db = require('../config/db');

var mijnObject = { 
	mijntekst: 'Hello World!',
	label: "Nog meer tekst",
	mijnarray: [ "tekst", "nog meer tekst", 2 ],
	mijnobject: {
		mijnlabel: 'mijntekst',
		getal: 4
	}
};

routes.get('/hello', function(req, res){
	res.contentType('application/json');
	res.status(200);
	res.json(mijnObject);
});

routes.get('/goodbye', function(req, res){
	res.contentType('application/json');
	res.status(200);
	res.json({ 'tekst': 'Goodbye!'});
});

routes.get('/actors', function(req, res){
	res.contentType('application/json');

	db.query('SELECT * FROM actor', function(error, rows, fields) {
		if (error) { 
			res.status(400);
			res.json({ error: 'Error while performing Query.'});
		} else {
			res.status(200);
			res.json(rows);
		};
	});
});

module.exports = routes;