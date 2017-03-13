var bodyParser = require('body-parser');
//setup express server dependencies
var express = require('express');
var app = express();
//front end static files automatically routed
app.use(express.static('public'));
//import mongo, request, cheerio
var mongojs = require('mongojs');
var cheerio = require('cheerio');
var request = require('request');

var Article = require('./models/Article.js');
var Comment = require('./models/Comment.js');

//mongoose setup
var mongoose = require('mongoose');
var db = mongoose.connection;

//catch any database errors
db.on("error", function (error) {
    console.log("Database error: ", error);
})
// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});
//middle-ware
// BodyParser makes it possible for our server to interpret data sent to it.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
//import handlebars
var exphbr = require('express-handlebars');
app.engine("handlebars", exphbr({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var PORT = process.env.PORT || 3000;
//listen on port 3000

require('./routes/app-routes.js')(app);
require('./routes/html-routes.js')(app);

app.listen(PORT, function () {
    console.log("App running on port 3000!");
})
