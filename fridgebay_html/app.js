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
var cloudinary = require('cloudinary');


app.use(express.bodyParser());
// serve static content from the public folder 
app.use("/", express.static(__dirname + '/public'));
app.use(logfmt.requestLogger());
// parse the bodies of all other queries as json
app.use(bodyParser.json());


//Uri allows access to the mongo database on the heroku server
var mongodbUri = 'mongodb://generic:Brandeisjbs2014@ds029217.mongolab.com:29217/heroku_app27280814';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);

mongoose.connect(mongooseUri);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));


db.once('open', function callback () {
    console.log("Database connected");
});

//Define Schemas for model 
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

//configure cloudinary
cloudinary.config({ 
  cloud_name: 'hllzrkglg', 
  api_key: '518419884741297', 
  api_secret: 'NRLgdFtnpweF3h0OFa63s0a0BbU' 
});

//this post uploads an item and saves it
app.post('/uploadItem', function(req, res) {

	var images = [];
	
	cloudinary.uploader.upload(req.files.image_1.path, function(result) { 
		if (req.files.image_1.size != 0) {
			images[images.length] = result.public_id;
		}

			cloudinary.uploader.upload(req.files.image_2.path, function(result) { 
				if (req.files.image_2.size != 0) {
					images[images.length] = result.public_id;
				}

				cloudinary.uploader.upload(req.files.image_3.path, function(result) { 
					if (req.files.image_3.size != 0) {
						images[images.length] = result.public_id;
					}

					new item({
						images: images,
						name: req.body.itemName,
						price: req.body.itemPrice,
						description: req.body.itemDesc,
						condition: req.body.itemCondition,
						category: req.body.itemMainCategory,
						subcategory: req.body.itemSubCategory,
						location: req.body.itemLocation,
						quantity: req.body.itemQuantity,
						sellBy: req.body.itemSellBy,
						status: false,
						seller: req.body.itemSeller,
						university: req.body.itemUniversity,
						interested: 0
					}).save();
		
					res.redirect('/');
			})
		})			
	});
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
    mongoose.model(req.params.collection).findByIdAndUpdate(req.params.id, { $set: { 
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
        university: req.body.university,
    }}, function (err, item) {
        if (err) return handleError(err);
        res.send(item);
    });
});

//Add new item to database
app.post('/model/:collection', function(req, res) {
    console.log("post ... " + JSON.stringify(req.body));
    console.log(images);    
    new item({
        images: [],
        name: req.body.itemName,
        price: req.body.itemPrice,
        description: req.body.itemDesc,
        condition: req.body.itemCondition,
        category: req.body.itemMainCategory,
        subcategory: req.body.itemSubCategory,
        location: req.body.itemLocation,
        quantity: req.body.itemQuantity,
        sellBy: req.body.itemSellBy,
        status: false,
        seller: req.body.itemSeller,
        university: req.body.itemUniversity,
        interested: 0
    }).save();
});

//Deletes an item from the database
app.delete('/model/:collection/:id', function (req, res) {
    var id = req.params.id;
    mongoose.model(req.params.collection).remove({_id:id}, function( err, item ){
        if(err) throw err;
        else console.log("Deleting Item: ID_" + req.params.id);
    })
});
  

//Sets port to 3000 for local host while using the port that heroku dynamically sets 
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
