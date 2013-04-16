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

//initialize Mongo 
var mongo = require('mongodb');
var mongoUri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/mydb'; 
mongo.Db.connect(mongoUri, function (err, db) {
  db.collection('mydocs', function(er, collection) {
    collection.insert({'mykey': 'myvalue'}, {safe: true}, function(er,rs) {
    });
  });
});



app.get('/', function(request, response) {
  response.send('Hello World!');
});


app.get('/submit.json', function(request, response) {
 response.send('error');
});

app.post('/submit.json', function(request, response) {
 
});


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});







