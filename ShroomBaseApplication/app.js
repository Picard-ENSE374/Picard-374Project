// express
const express = require ( "express" );
const session = require("express-session")

// mongoose
const mongoose = require( 'mongoose' );
ObjectId = require('mongodb').ObjectID;

// passport
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose");
require("dotenv").config();
process.env.DB_HOST

// application
const app = express();
const port = 3000;

// routing
app.listen (port, () => { console.log (`Server is running on http://localhost:${port}`);});

// application depends setup
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true}));

// connecting to database
mongoose.connect( 'mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

// selecting global variables
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

// starting passport
app.use(passport.initialize());
app.use(passport.session());

// usetting up the current user
app.use(function(req,res,next){ res.locals.currentUser = req.user; next();})  

// creating the three schemas we will be using
const usersSchema = new mongoose.Schema (
    {
    username: String,
    password: String
    }
);

const mushroomsSchema = new mongoose.Schema ({
    name: String,
    scientific: String,
    safe: Boolean, 
    location: String, 
    benefits: String, 
    symptoms: String, 
    facts: String,
    imageFile: String,
});

const favouritesSchema = new mongoose.Schema ({
    mushroom: String, 
    username: String
});

// setting up passport to correct schema
usersSchema.plugin(passportLocalMongoose);

// creating the other three schemas
var Users = mongoose.model ( "Users", usersSchema );
var Mushrooms = mongoose.model ( "Mushrooms", mushroomsSchema );
var Favourites = mongoose.model ("Favourites", favouritesSchema);

// passport rules for users
passport.use(Users.createStrategy());
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

// creating two global variables
var searched = false; 
var searched_input = ""; 

// the login page path
app.get("/", function (req, res) {
    res.render("login")
});

// the main page path
app.get( "/mainPage", async( req, res ) => {
    console.log("A user is accessing the reviews route using get, and...");
    if ( req.isAuthenticated() ){
        try {
            console.log( "was authorized and found:" );
            var mushrooms = await Mushrooms.find();
            var favourites = await Favourites.find();
            res.render( "mainPage", {mushrooms : mushrooms, searched : searched, input : searched_input, favourites : favourites});
            var searched = false; 
            var searched_input = ""; 
        } catch ( error ) {
            console.log( error );
        }
    } else {
        console.log( "was not authorized." );
        res.redirect( "/" );
    }
});

// the mushroom display path
app.post( "/mushroomDisplay", async( req, res ) => {
    console.log("A user is accessing the reviews route using get, and...");
    if ( req.isAuthenticated() ){
        try {
            var mushrooms = await Mushrooms.find();
            var mushroom = await Mushrooms.findOne(ObjectId(req.body["mushroomid"]));
            var favourites = await Favourites.find();
            searched = false; 
            var searched_input = ""; 
            res.render( "mushroomDisplay", {mushroom : mushroom, mushrooms : mushrooms, searched : searched, input : searched_input, favourites : favourites});
        } catch ( error ) {
            console.log( error );
        }
    } else {
        console.log( "was not authorized." );
        res.redirect( "/" );
    }
});

// the mushroom search path
app.post("/searchMushroom", async( req, res ) => {
    if ( req.isAuthenticated() ){
    searched = true; 
    type = req.body["search_page"]; 
    mushroom = req.body["search_id"];
    searched_input = req.body["search_input"]; 
    var favourites = await Favourites.find();
    if (searched_input == null || searched_input  == "")
    {
        mushrooms = await Mushrooms.find();
    }
    else 
    {
        mushrooms = await Mushrooms.find({ $or: [{"name": new RegExp(searched_input,'i')}, 
                                            {"benefits": new RegExp(searched_input,'i')},
                                            {"symptoms": new RegExp(searched_input,'i')},
                                            {"facts": new RegExp(searched_input,'i')},] 
                                        });
    }
    if (type == "main" || mushroom ==null)
    {
        res.render("mainPage", {mushrooms : mushrooms, searched : searched, input : searched_input, favourites : favourites});
    }
    else
    {
        var mushroom = await Mushrooms.findOne(ObjectId(mushroom));
        res.render("mushroomDisplay", {mushroom : mushroom, mushrooms : mushrooms, searched : searched, input : searched_input, favourites : favourites});
    }
} else {
    console.log( "was not authorized." );
    res.redirect( "/" );
}
});

// the login path
app.post("/login", ( req, res ) => {
    console.log( "User " + req.body.username + " is attempting to log in" );
    const user = new Users ({
        username: req.body.username,
        password: req.body.password
    });
    req.login ( user, ( err ) => {
        if ( err ) {
            console.log( err );
            res.redirect( "/" );
        } else {
            passport.authenticate( "local", { failureRedirect: '/' } )( req, res, () => {
                res.redirect( "/mainPage" ); 
            });
        }
    });
});

// the register path
app.post( "/register", (req, res) => {
    console.log( "User " + req.body.username + " is attempting to register" );
    console.log( req.body.InputAuth);
    Users.register({ username : req.body.username}, 
                    req.body.password, 
                    ( err, user ) => {
        if ( err ) {
        console.log( err );
            res.redirect( "/" );
        } else {
            passport.authenticate( "local", { failureRedirect: '/' } )( req, res, () => {
                res.redirect( "/" ); 
            });
        }
    });
});

// the logout path
app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { 
          return next(err); 
      }
      res.redirect('/');
    });
  });

  // the change password path
  app.post("/changePassword", async(req, res ) => {
    console.log(req.body.username);
    user_to_change = await Users.findOne({"username": req.body.username});
            console.log(user_to_change);
            console.log(req.body.oldpassword);
            console.log(req.body.newpassword);
            user_to_change.changePassword(req.body.oldpassword, 
            req.body.newpassword, function (err) {
                if (err) {
                    res.redirect( "/" );
                } else {
                    res.redirect( "/" );
                }
            });
});

// favourite mushroom path
app.post("/favouriteMushroom", async( req, res ) => {
    if ( req.isAuthenticated() ){
    searched = true; 
    mushroom = req.body["mushroomname"];
    username = req.body["username"];
    favourited = await Favourites.find({"username": username, "mushroom": mushroom});
    mushrooms = await Mushrooms.find();
    favourites = await Favourites.find();
    if (!favourited.length)
    {
        Favourites.insertMany([{"username": username, "mushroom": mushroom}]);
        console.log("inserting");
    }
    else
    {
        Favourites.deleteMany({"username": username, "mushroom": mushroom}).remove().exec();
        console.log("deleting");
    }
    res.redirect("/mainPage");
} else {
    console.log( "was not authorized." );
    res.redirect( "/" );
}
});