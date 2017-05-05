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

//
// Geef een lijst van alle actors. Dat kunnen er veel zijn.
//
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

//
// Retourneer één specifieke actor. Hier maken we gebruik van URL parameters.
// Vorm van de URL: http://hostname:3000/api/v1/actors/23
//
routes.get('/actors/:id', function(req, res){

	var actorId = req.params.id;

	res.contentType('application/json');

	db.query('SELECT * FROM actor WHERE actor_id=?', [ actorId ], function(error, rows, fields) {
		if (error) { 
			res.status(400);
			res.json({ error: 'Error while performing Query.'});
		} else {
			res.status(200);
			res.json(rows);
		};
	});
});

//
// Zoek in een gegeven tabel. Je kunt zoeken op attribuut én een zoekwaarde meegeven.
// we maken hier gebruik van queryparameters.
// Vorm van de URL: http://hostname:3000/api/v1/search?type=actor&key=first_name&value=JOHN&limit=5
//
routes.get('/search', function(req, res){

	var type = req.query.type;
	var key = req.query.key || '';
	var value = req.query.value || '';
	var limit = req.query.limit;

	res.contentType('application/json');

	// 1. type is verplicht. Zonder type kunnen we niet zoeken.
	if(type === undefined || type === '') {
		res.status(400);
		res.json({ error: 'Type is een verplichte parameter.'});
	}

	// 2. Bouw de query op met de waarden die we hebben.
	var query = 'SELECT * FROM \`' + type + '\`';

	// 3. Check of key en value bestaan.
	if((key !== '') && (value !== '')) {
		query += ' WHERE \`' + key + '\`=' + db.escape(value);
	}

	// 4. Is limit gegeven?
	if(limit !== undefined) {
		query += ' LIMIT ' + limit; 
	}

	console.log('Onze query: ' + query);

	db.query(query, function(error, rows, fields) {
		if (error) { 
			res.status(400);
			res.json(error);
		} else {
			res.status(200);
			res.json(rows);
		};
	});
});

//
// Voeg een actor toe. De nieuwe info wordt gestuurd via de body van de request message.
// Vorm van de URL: POST http://hostname:3000/api/v1/actors
//
routes.post('/actors', function(req, res){

	var actor = req.body;
	var rows = [];
	var query = {
		sql: 'INSERT INTO `actor`(first_name, last_name) VALUES (?, ?)', 
		values: [ actor.first_name, actor.last_name ],
		timeout: 2000 // 2secs
	};

	console.dir(actor);
	console.log('Onze query: ' + query.sql);

	res.contentType('application/json');
	db.query(query, function(error, rows, fields) {
		if (error) { 
			res.status(400);
			res.json(error);
		} else {
			res.status(200);
			res.json(rows);
		};
	});
});


module.exports = routes;