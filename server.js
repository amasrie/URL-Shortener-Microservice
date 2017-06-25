require('dotenv').load();
var express = require('express');
var app = express();
var moment = require('moment');
var mongo = require('mongodb').MongoClient;
var validUrl = require('valid-url');
var counter;
var db;

app.use(express.static('public'));

app.get("/url/*", function(req, res){
  var link = req.originalUrl.substr(5);
  if(validUrl.isUri(link)){
    db.collection('url').find({'original_url': link })
      .toArray(function(err, documents) {
        if(err) return err;
        if(documents.length > 0){
          res.send({ "original_url": documents[0].original_url, "short_url": documents[0].short_url});
        }else{
          counter++;
          var doc = {"original_url": link, "short_url": req.protocol + '://' + req.get('host') + '/' + counter };
          db.collection('url').insert(doc, function(err, data){
            if(err) throw err;
            res.send(doc);
          });
        }
      });
  }else{
    res.send({'error': 'The string doesn\'t match a valid URL. ake sure you have a valid protocol'});
  }
});

app.get("/:code", function(req, res){
  db.collection('url').find({'short_url': req.protocol + '://' + req.get('host') + '/' + req.params.code})
    .toArray(function(err, documents) {
      if(err) return err;
      if(documents.length == 0){
        res.send({'error': 'This code has no URL.'});
      }else{
        res.redirect(documents[0].original_url);
      }
    });
})

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests
mongo.connect(process.env.MONGO, function(err, data) {
  if(err) return console.log(err);
  db = data;
  if(typeof counter == 'undefined'){
    db.collection('url').count({}, function(err, data){
      if(err) return console.log(err);
      counter = data;
    });
  }
	var listener = app.listen(process.env.PORT, function () {
	  console.log('Your app is listening on port ' + listener.address().port);
	});
});
