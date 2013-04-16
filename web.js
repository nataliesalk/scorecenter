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
/*
	db.collection('highscores', function (err, collection) {
    collection.insert({'game_title':'frogger', 'username': 'natalie', 'score': '150'});
//   	response.send('inserted');
  });
*/
  var collection = db.collection('highscores');
  JSON.stringify(collection);
  response.set('Content-Type','text/html');
  response.send(collection);
  
});


app.get('/displayuser', function (request, response) {
 response.set('Content-Type','text/html');
 response.send(db.highscores.username[1]);
});

app.post ("/submit.json", function (request, response) {

	var username = request.body.username;
	var game = request.body.game_title;
	var score = request.body.score;
	var date = request.body.created_at;
	console.log(username);
	console.log(score);
	
});

app.get('/highscores.json', function(request, response) {
response.send('this is where the highscores in json format will be');

});

app.get('/username', function(request, response) {
response.send('this is where you will search for a username ');
});

app.post ("/username", function (request, response) {

});


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});







