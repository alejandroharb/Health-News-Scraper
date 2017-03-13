//dependencies
var request = require('request');
var cheerio = require('cheerio');
//MONGODB configurations
var mongojs = require('mongojs');
var databaseURL = "healthNewsScraped";
// var collections = ["scientificAmerican"];
// var db = mongojs(databaseURL, collections)
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/healthNewsScraped');
mongoose.Promise = Promise;


var Article = require('./../models/Article.js');
var Comment = require('./../models/Comment.js');

module.exports = function (app) {
    app.get('/health-news', function (req, res) {
        var webURL = 'https://www.scientificamerican.com/health';
        var rootURL = 'https://www.scientificamerican.com'
        scrapeSiteArticles(webURL, rootURL, function () {
            Article.find({}, function (error, data) {
                if (error) { console.log(error) };
                res.send(data);
            });
        });

    })
}

function scrapeSiteArticles(webURL, rootURL, cb) {
    request(webURL, function (error, response, html) {
        var $ = cheerio.load(html);
        var result = {};
        $('article').each(function (index, elem) {
            result.link = $(this).find('a').attr('href');
            result.imageLink = rootURL + $(this).find('img').attr('src');
            result.title = $(this).attr('data-listing-title');

            var entry = new Article(result);

            entry.save(function (err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(doc);
                }
            })
        })
        // db.scientificAmerican.insert(resultData);

    })
    cb();
}
