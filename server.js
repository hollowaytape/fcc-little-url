var express = require('express');
var app = express();

var mongo = require('mongodb').MongoClient;
var mongoUri = process.env.MONGO_URI

var base62 = require('base62');

//var url = require('url');
var port = process.env.PORT || 8080;


app.get('/new/:url', function(req, res) {
	var longUrl = req.params.url;
	var shortUrl = base62.decode(longUrl);

	mongo.connect(mongoUri, function(err, db) {
		if (err) throw err;

		var urls = db.collection('urls');

		var doc = { original_url: longUrl,
		            short_url: shortUrl};

		urls.insert(doc, function(err, data) {
			if (err) throw err;

			else console.log(JSON.stringify(doc));
		});
		db.close();
	});
})

app.listen(port, function() {
	console.log('Express app listening on port' + port);
})