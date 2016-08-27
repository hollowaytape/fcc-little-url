var express = require('express');
var app = express();

var mongo = require('mongodb').MongoClient;
var mongoUri = process.env.MONGO_URI

var shortid = require('shortid');

var port = process.env.PORT || 8080;
var webhost = "http://localhost:8080/";


// (*) prevents the additional slashes of a url from confusing Express.
app.get('/new/:url(*)', function(req, res, next) {
	var longUrl = req.params.url;
	
	mongo.connect(mongoUri, function(err, db) {
		if (err) throw err;

		var collection = db.collection('urls');

		var newLink = function(db, callback) {
			var insertLink = { original_url: longUrl, short_url: "test" };
			collection.insert([insertLink]);
			res.send(longUrl);
		};

		newLink(db, function() {
			db.close();
		});
	})
})

app.listen(port, function() {
	console.log('Express app listening on port' + port);
})