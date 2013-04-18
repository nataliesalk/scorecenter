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

//code
app.get('/', function(request, response) {
/*
	db.collection('highscores', function (err, collection) {
    collection.insert({'game_title':'frogger', 'username': 'natalie', 'score': '150'});
//   	response.send('inserted');
  });
*/
  var collection = db.collection('highscores');
//  var highscores=db.highscores.find();
  response.set('Content-Type','json');
  response.send('collection');
  
});


app.get('/displayuser', function (request, response) {
  var user = request.body.username;
  var content = '';
  db.collection('scores', function (error, collection) {
    collection.find({username:user}).sort({score:1}, function (err, cursor) {
      cursor.each(function (err, item) {
        if (item) {
          content = content + '<tr><td>' + item.game_title + '</td><td>' + item.score + '</td><td>' + item.created_at + '</td></tr>';
        }
        else {
          db.close();
          response.set('Content-Type', 'text/html');
          response.send('<!DOCTYPE html><html><h1>Displaying a list of scores for ' + user + '</h1><table border=1px width=400px><tr><td>Game</td><td>Score</td><td>Date Played</td></tr>' + content + '</table><p><a href="/">Back to all highscores</a></p></html>');
        }
      });
    });
  });
});


//Send data to mongodb
app.post('/submit.json', function (request, response) {
  if (request.username && request.score && request.game_title) {
    db.collection('scores', function (err, collection) {
   	  var date = new Date;
      var username = "{ 'username' : " + request.username + "}";
      var game_title = "{ 'game_title' : " + request.game_title + "}";
      var score = "{ 'score' : " + request.score + "}";
      jsonstring = '{' + username + game_title + score + date + '}';
      console.log(jsonstring);
      collection.insert(jsonstring);
    });
  }
});


app.get ("/submit.json", function (request, response) {
response.send('this page sends the information to mongo');
});


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
          db.close();
          response.set('Content-Type', 'text/json');
          response.send(content);
        }
      });
    });
  });
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







