var express = require('express');
var app = express();

var mongo = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var mongoUri = process.env.MONGO_URI
var webhost = "http://localhost:8080/";

//var url = require('url');
var port = process.env.PORT || 8080;

var BASE58ALPHABET = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789";

function hashFromId(id) {
	var encoded = '';
	while (id) {
		var remainder = id % 58;
		id = Math.floor(id / 58);
		encoded = BASE58ALPHABET[remainder].toString() + encoded;
	}
	return encoded;
}

function idFromHash(hash) {
	var decoded = 0;
	while (str) {
		var index = BASE58ALPHABET.indexOf(str[0]);
		var power = str.length - 1;
		decoded += index * (Math.pow(base, power));
		str = str.substring(1);
	}
	return decoded;
}

var counterSchema = new mongoose.Schema({
	_id: {type: String, required: true},
	seq: {type: Number, default: 0}
});

var urlSchema = new mongoose.Schema({
	_id: {type: Number, index: true},
	longUrl: String
});

urlSchema.pre('save', function(next){
	var doc = this;

	counter.findByIdAndUpdate({_id: '57bcd3ef4c18f9401c4dd484'}, {$inc: {seq: 1} }, function(err, counter) {
		if (err) return next(err);

		doc._id = counter.seq;
		next();
	})
});

var Url = mongoose.model('Url', urlSchema);


app.get('/new/:url', function(req, res) {
	var longUrl = req.params.url;

	mongo.connect(mongoUri, function(err, db) {
		if (err) throw err;
		var urls = db.collection('urls');
		var doc = { longUrl: longUrl }

		Url.findOne({longUrl: longUrl}, function(err, doc) {
			if (doc) {
				// Url is already in database.
				shortUrl = webhost + hashFromId(doc._id);
				res.send({"short_url": shortUrl});
			} else {
				// Url not in the database yet, so create a new one.
				var newUrl = Url({
					longUrl: longUrl
				});

				newUrl.save(function(err) {
					if (err) throw err;

					shortUrl = webhost + hashFromId(doc._id);
					res.send({"short_url": shortUrl});
				})
			}
		})
		db.close();
	});
})

app.listen(port, function() {
	console.log('Express app listening on port' + port);
})