//dependencies
var request = require('request');
var cheerio = require('cheerio');
//MONGODB configurations
var mongojs = require('mongojs');
var databaseURL = "healthNewsScraped";
// var collections = ["scientificAmerican"];
// var db = mongojs(databaseURL, collections)
var mongoose = require('mongoose');
mongoose.connect('mongodb://heroku_36q0hwf6:62ded92ilnnkeekl47dl48dleh@ds125060.mlab.com:25060/heroku_36q0hwf6');
mongoose.Promise = Promise;


var Article = require('./../models/Article.js');
var Comment = require('./../models/Comment.js');

module.exports = function (app) {
    app.get('/health-news', function (req, res) {
        var webURL = 'https://www.scientificamerican.com/health';
        var rootURL = 'https://www.scientificamerican.com'
        scrapeSiteArticles(webURL, rootURL, function () {
            Article.find({})
            .populate("comment")
            .exec(function(error, articleDoc) {
                if(error) {console.log(error)}
                else {
                    console.log(articleDoc)
                    res.json(articleDoc)
                }
            })
        });
    })
    app.post('/newComment', function(req, res) {
        var data = req.body;
        var commentData = {body: data.comment}
        console.log("=========comment data========")
        console.log(data)
        var newComment = new Comment(commentData);
        newComment.save(function(error, commentDoc) {
            if (error) { console.log(error)}
            else {
                console.log("commentDoc")
                console.log(commentDoc)
                Article.findOneAndUpdate({"_id": data.articleId},{ $push: {"comment": commentDoc._id}}, {new:true})
                    .exec(function(err, articleDoc) {
                        if(err) {
                            console.log(err);
                        } else {
                            //response of new article object with comment
                            Article.find({_id: articleDoc._id})
                                .populate("comment")
                                .exec(function(error, articleDocPopulated) {
                                    if(error) {console.log(error)}
                                    else {
                                        res.json(articleDocPopulated)
                                    }
                                })
                        }
                    })
            }
        })
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
