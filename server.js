/* 
	URL Shortener project for Free Code Camp, part of the Back-End Development Certificate.
*/

var express = require('express');
var app = express();

var mongo = require('mongodb').MongoClient;
var mongoUri = process.env.MONGO_URI;
var WEBHOST = process.env.WEBHOST;

var path = require('path');

var shortid = require('shortid');
var valid_url = require('valid-url');

var port = process.env.PORT || 8080;

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
})

// (*) prevents the additional slashes of a url from confusing Express.
app.get('/new/:url(*)', function(req, res, next) {
	var longUrl = req.params.url;

	if (valid_url.isUri(longUrl)) {
		mongo.connect(mongoUri, function(err, db) {
		// (If you're getting "Parameter 'url' must be string, not undefined" make sure the env variables are loaded)
		if (err) throw err;

		var collection = db.collection('urls');

		// TODO: Overwrite or don't write a new link with the same original_url.

		var newLink = function(db, callback) {
			var shortUrl = WEBHOST + shortid.generate();
			var insertLink = { original_url: longUrl, short_url: shortUrl };
			collection.insert([insertLink]);
			res.send(insertLink);
		};

		newLink(db, function() {
			db.close();
		});
	})
	} else {
		res.send({'error': 'Invalid url format.'});
	}
})

app.get('/:url(*)', function(req, res, next) {
	var shortUrlQuery = WEBHOST + req.params.url;
	console.log(shortUrlQuery);

	if (valid_url.isUri(shortUrlQuery)) {
		mongo.connect(mongoUri, function(err, db) {
			if (err) throw err;

			var collection = db.collection('urls');
			console.log(shortUrlQuery);
			var result = collection.find({
				short_url: shortUrlQuery
			}).toArray(function(err, documents) {
				if (err) return null;
				else {
					console.log(documents);
					console.log(documents[0]);
					console.log(documents[0].original_url);
					var redirectUrl = documents[0].original_url;
					res.redirect(redirectUrl);
				}
			})
		db.close()
		})
	}
})

app.listen(port, function() {
	console.log('Express app listening on port ' + port);
})