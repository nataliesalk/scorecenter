//express initialize
var express = require("express");
var app = express();
app.use(express.logger());

//enable cross origin requests 
app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

//Mongo Initialization 
var mongoUri = process.env.MONGOLAB_URI ||
   process.env.MONGOHQ_URL ||
   'mongodb://localhost/scorecenter';
var mongo = require('mongodb');
var db = mongo.Db.connect(mongoUri, function (error, databaseConnection) {
	 console.log(error);
     db = databaseConnection;
});

//code
app.get('/', function(request, response) {
	db.collection('highscores', function (err, collection) {
    collection.insert({'game_title':'frogger', 'username': 'natalie', 'score': '150'});
//   	response.send('inserted');
  });
  response.set('Content-Type','text/html');
  response.send('Hello World!');
});



app.get('/displayuser', function (request, response) {
 response.set('Content-Type','text/html');
 response.send(db.highscores.username);
});


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});







