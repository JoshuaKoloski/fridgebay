#!/usr/bin/env node --harmony

/***
 ***/

'use strict';
var express = require('express');
var bodyParser = require('body-parser'); // this allows us to pass JSON values to the server (see app.put below)
var app = express();
var logfmt = require("logfmt");
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
// var db = monk('/fridgebay');

// serve static content from the public folder 
app.use("/", express.static(__dirname + '/public'));
app.use(logfmt.requestLogger());
// parse the bodies of all other queries as json
app.use(bodyParser.json());


var mongodbUri = 'mongodb://generic:Brandeisjbs2014@ds029217.mongolab.com:29217/heroku_app27280814';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);

mongoose.connect(mongooseUri);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

//Define Schema for model 
db.once('open', function callback () {
    console.log("Database connected");
});
var itemsSchema = mongoose.Schema({
        images: Array,
        name: String,
        price: Number,
        description: String,
        condition: String,
        category: String,
        subcategory: String,
        location: String,
        quantity: Number,
        sellBy: Date,
        status: Boolean, 
        seller: String,
        university: String,
        interested: Number
});

var usersSchema = mongoose.Schema({
    email: String,
    phone: String,
    username: String,
    nest: Array,
    contact: Boolean,
    sell: Array
});

var item = mongoose.model('items', itemsSchema);
var user = mongoose.model('users', usersSchema);

// log the requests
app.use(function(req, res, next) {
    console.log('%s %s %s', req.method, req.url, JSON.stringify(req.body));
    next();
});

// get a particular item from the model
app.get('/model/:collection/:id', function(req, res) {
    mongoose.model(req.params.collection).find({_id:req.params.id}, function(err, item){
        res.send(item);
    });
});

// get all items from the model
app.get('/model/:collection', function(req, res) {
    mongoose.model(req.params.collection).find(function(err,items){
        res.send(items)
    });
});

// change an item in the model
app.put('/model/:collection/:id', function(req, res) {
    var collection = db.get(req.params.collection);
    collection.update({
        "_id": req.params.id
    }, req.body);
    res.json(200, {});
});

//Add new item to database
app.post('/model/:collection', function(req, res) {
    console.log("post ... " + JSON.stringify(req.body));
    new item({
        images: req.body.images,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        condition: req.body.condition,
        category: req.body.category,
        subcategory: req.body.subcategory,
        location: req.body.location,
        quantity: req.body.quantity,
        sellBy: req.body.sellBy,
        status: req.body.status, 
        seller: req.body.seller,
        university: req.body.university,
        interested: 0
    }).save();
});

// delete a particular item from the model
// app.delete('/model/:collection/:id', function(req, res) {
//     mongoose.model(req.params.collection).remove({_id:req.params.id}, function(err, item){
//         if (err) return handleError(err);
//         console.log("Deleting item: " + item);
//     })
// });

app.delete('/model/:collection/:id', function (req, res) {
    id = req.params.id;
    mongoose.model(req.params.collection).remove({_id:id})
});
  



//Sets port to 3000 for local host while using the port that heroku dynamically sets 
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
