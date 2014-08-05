#!/usr/bin/env node --harmony


'use strict';
var express = require('express');
var bodyParser = require('body-parser'); // this allows us to pass JSON values to the server (see app.put below)
var app = express();
var logfmt = require("logfmt");
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var cloudinary = require('cloudinary');

//***************************  DATABASE INITIALIZATION *******
//Uri allows access to the mongo database on the heroku server
var mongodbUri = 'mongodb://generic:Brandeisjbs2014@ds029217.mongolab.com:29217/heroku_app27280814';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);

mongoose.connect(mongooseUri);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));


db.once('open', function callback() {
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
    seller: String,  // openID of the seller
    university: String,
    interested: Number
});

var usersSchema = mongoose.Schema({
    email: String,
    phone: String,
    username: String,
    nest: Array,
    contact: Boolean,
    message:Object, 
    sell: Array
});

var messageSchema = mongoose.Schema({
	text: String,
	date: Date
})
var userSchema = mongoose.Schema({
    openID: String,
    profile: Object,
    name:String,
    email:String,
    phone: String,
    interestList: Array,
    number: Number,
    messages: Array,  // {message: String, new: Boolean, sentBy: String (User Id)
    sellingList: Array,
    currentItem: Array
});

var item = mongoose.model('items', itemsSchema);


//var user = mongoose.model('users', usersSchema);
var user2 = mongoose.model('user2', userSchema);
var text= mongoose.model('messages', messageSchema);

//***************************  END OF DATABASE INITIALIZATION *******


//**********************************************************
// The following is needed for the passport authentication 
//**********************************************************
var cookieParser = require('cookie-parser');
var session = require('express-session');

var redisClient = require('redis').createClient();
var RedisStore = require('connect-redis')(session);

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("\n\n$$$$$$$$$$\n\n req.user=" + JSON.stringify(req.user));
        return next();
    } else {
        res.redirect('/');
    }
};

passport.serializeUser(function(user, done) {
    //console.log("serializeUser: "+JSON.stringify(user));
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    //console.log("deserializeUser: "+JSON.stringify(obj));
    done(null, obj);
});


passport.use(new GoogleStrategy({
    clientID: '590986965614-k8mij5ml9sg33urltfhql84ga8mh56uf.apps.googleusercontent.com',
    clientSecret: 'CaQZayiEHhPnKDrEsuYKaIp4',
		//    callbackURL: "http://fridgebay.herokuapp.com/oauth2callback"
    //callbackURL: "http://localhost:8000/oauth2callback"
    callbackURL: "http://leiner.cs-i.brandeis.edu:8000/oauth2callback"
},
	function(accessToken, refreshToken, profile, done) {
	    console.log("\n \n \n \n *********** aT = " + JSON.stringify(accessToken) + 
		    "\n  rt=" + JSON.stringify(refreshToken) +
		    "\n  pr=" + JSON.stringify(profile));
	    mongoose.model('user2').find({
	        openID: profile.id
	    }, function(err, userList) {
	        console.log("err = " + JSON.stringify(err) + "\n  user=" + JSON.stringify(userList));
	        if (userList.length == 0) {
	            // if this is the first visit for the user, then insert him/her into the database
	            var user = {};
	            user.openID = profile.id;
	            user.profile = JSON.stringify(profile);
	            user.phone = "none";
	            user.name = profile.displayName;
	            var emails = profile.emails;
	            user.email = emails[0].value;
	            user.interestList=[];               
	            user.sellingList=[];
	            user.currentItem=[];
	            user.number=0;
	            user.messages=[];
	            // store a new user ....
	            new user2(user).save();
	            //console.log("inserted user");
	            done(null, user);
	        } else {
	            // the user has been here before and there should only be one user
	            // matching the query (user[0]) so pass user[0] as user ...
	            console.log("Google Strategy .. user = " + JSON.stringify(userList[0]));
	            done(err, userList[0]);
	        }
	    });
	}));

//**********************************************************


passport.serializeUser(function(user, done) {
    //console.log("serializeUser: "+JSON.stringify(user));
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    //console.log("deserializeUser: "+JSON.stringify(obj));
    done(null, obj);
});

//**********************************************************

app.use(express.bodyParser());
// serve static content from the public folder 
app.use("/", express.static(__dirname + '/public'));
app.use(logfmt.requestLogger());
// parse the bodies of all other queries as json
app.use(bodyParser.json());

//**********************************************************
// This is needed for the passport authentication
// start using sessions...
//**********************************************************
//app.use(session({ secret: 'jfjfjfjf89fd89sd90s4j32kl' }));
app.use(cookieParser());
app.use(session({
    secret: 'unguessable',
    store: new RedisStore({
        client: redisClient
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
	passport.authenticate('google', 

			      {scope: 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/plus.login https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'}));



app.get('/oauth2callback', 
	passport.authenticate('google', { failureRedirect: '/' }),
	function(req, res) {
	    // Successful authentication, redirect home.
	    res.redirect('/');
	});



// serve static content from the public folder 
app.use("/login.html", express.static(__dirname + '/public/login.html'));
app.use("/logout.html", express.static(__dirname + '/public/logout.html'));

// we require everyone to login before they can use the app!
app.use(ensureAuthenticated, function(req, res, next) {
    next()
});

//**********************************************************



// log the requests
/*app.use(function(req, res, next) {
    console.log('%s %s %s', req.method, req.url, JSON.stringify(req.body));
    next();
});*/

//configure cloudinary
cloudinary.config({
    cloud_name: 'hllzrkglg',
    api_key: '518419884741297',
    api_secret: 'NRLgdFtnpweF3h0OFa63s0a0BbU'
});

//**********************************************************
// this is just to demonstrate how to use the ensureAuthenticated middleware
// to restrict access to a route to authenticated users
//**********************************************************
app.use("/secret", ensureAuthenticated, function(req, res) {
    res.redirect("http://www.brandeis.edu");
})


app.get('/auth/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// this returns the user info
app.get('/api/user', function(req, res) {
	console.log("User: " + JSON.stringify(req.user));
    mongoose.model("user2").find({
        openID: req.user.openID
    }, function(err, items) {
        console.log("user is "+JSON.stringify(item));
        if (item.length > 0)
            res.send(items[0]);
        else
            res.json(404,{});
    });
    //res.json(req.user);
});

//**********************************************************

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

app.post('/model/messages', function(req,res){
	new text({
		text: req.body.text,
		date: req.body.date
	}).save();
	console.log("Message has been submitted");
})

// get a particular item from the model
app.get('/model/:collection/:id', function(req, res) {
    mongoose.model(req.params.collection).find({
        _id: req.params.id
    }, function(err, item) {
        res.send(item);
    });
});

// get all items from the model
app.get('/model/:collection', function(req, res) {
    mongoose.model(req.params.collection).find(function(err, items) {
        res.send(items)
    });
});

app.put('/model/:user2/:id', function(req, res) {
    mongoose.model(req.params.user2).findByIdAndUpdate(req.params.id,req.body, function (err, raw, user) {
        console.log('The raw response from Mongo was ', raw)
        res.json(200, {});
    });
});

// change an item in the model
app.put('/model/:collection/:id', function(req, res) {
    mongoose.model(req.params.collection).findByIdAndUpdate(req.params.id,req.body, function (err, raw, item) {
        console.log('The raw response from Mongo was ', raw)
        res.json(200, {});
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

// delete a particular item from the model
app.delete('/model/:collection/:id', function(req, res) {
    var id = req.params.id;
    //delete item images from cloudinary
    /*
    mongoose.model(req.params.collection).find({
        _id: id
    }, function(err, item) {
        for (var i = 0; i < item[0].images.length; i++) {
            cloudinary.uploader.destroy(item[0].images[i], function(result) {
                console.log(result)
            });
        }
    })*/
    //delete item from database
    mongoose.model(req.params.collection).remove({
        _id: id
    }, function(err, item) {
        if (err) throw err;
        else console.log("Deleting Item: ID_" + req.params.id);
    })
    res.json(200, {});
});

//Sets port to 3000 for local host while using the port that heroku dynamically sets 
app.listen(process.env.PORT || 8000, function() {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
