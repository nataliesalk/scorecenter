//express initialize
var express = require("express");
var app = express();
app.use(express.logger());
app.use(express.bodyParser());

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

//orginal page 
app.get('/', function(request, response) {
 db.collection('highscores', function (err, collection) {
    collection.find().sort({game_title:1}, function (err, cursor) {
      console.log(err);
      var content = '';
      cursor.each(function (err, item) {
        console.log(err);
        if (item) {
          content = content + '<tr><td>' + item.game_title + '</td><td>' + item.username + '</td><td>' + item.score + '</td><td>' + item.created_at + '</td></tr>';
        } 
        else {
          response.set('Content-Type', 'text/html');
          response.send('<!DOCTYPE html><html><head><title>Scorecenter</title></head><body><h1>Scores</h1><p><a href="/usersearch">Find scores for a specific user</a></p><p>Find the top 10 scores for any game</p><form name="topscores" action="highscores.json" method="get">Game: <input type="text" name="game_title"><input type="submit" value="Submit"></form><p>Scores for all Games:</p><p><table border=1px width=400px><tr><td>Game</td><td>Username</td><td>Score</td><td>Date Played</td></tr>' + content + '</table></p></body></html>');
        }
      });
    });
  });
})







//shows all of the scores in json format 
app.get('/highscores.json', function (request, response) {
  var game = request.query;
  var content = '';
	db.collection('highscores', function (error, collection) {
   	 collection.find(game).sort({score:-1}).limit(10, function (err, cursor) {
   	  cursor.each(function (er, item) {
         if (item) {
     	     content = content + JSON.stringify(item);
      	  }
      	 else {
      	    response.set('Content-Type', 'text/json');
      	    response.send(content);
         }
      });
    });
  });
});

//get the usersearch page 
app.get('/usersearch', function (request, response) {
  response.set('Content-Type', 'text/html');
  response.send('<!DOCTYPE html><html><head><title>User Search</title></head><body><h1>Find A List Of Scores For A Gamer</h1><form name="search" action="usersearch" method="post">Username: <input type="text" name="username"><input type="submit" value="Submit"></form><p><a href="/">Back to all highscores</a></p></body></html>');
});

//this posts the data onto the page 
app.post('/usersearch', function (request, response) {
  var user = request.body.username;
  var content = '';
  db.collection('highscores', function (error, collection) {
    collection.find({username:user}).sort({score:1}, function (err, cursor) {
      cursor.each(function (err, item) {
        if (item) {
          content = content + '<tr><td>' + item.game_title + '</td><td>' + item.score + '</td><td>' + item.created_at + '</td></tr>';
        }
        else {
          response.set('Content-Type', 'text/html');
          response.send('<!DOCTYPE html><html><h1> ' + user + 's Scores </h1>'+'<p><a href="/">Back to all highscores</a></p></html>'+'<table border=1px width=400px><tr><td>Game</td><td>Score</td><td>Date Played</td></tr>' + content + '</table>');
        }
      });
    });
  });
});


app.post('/submit.json', function (request, response) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "X-Requested-With");
	  var username = request.body.username;
	  var score = parseInt(request.body.score,10);
	  var game = request.body.game;
 	  var data = {"username":username, "score":score, "game_title":game, "created_at": Date()};
  db.collection('highscores', function (err, collection) {
  	  collection.insert(data);
  	  response.send([{'game_title': game, 'score': score, 'username': username, 'created_at': Date() }]);	
  });
});





var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});







