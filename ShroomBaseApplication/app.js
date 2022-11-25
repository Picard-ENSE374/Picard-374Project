const express = require ( "express" );
const session = require("express-session")
const mongoose = require( 'mongoose' );
ObjectId = require('mongodb').ObjectID;
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose");
require("dotenv").config();
process.env.DB_HOST

const app = express();
const port = 3000;

app.listen (port, () => { console.log (`Server is running on http://localhost:${port}`);});

app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true}));

mongoose.connect( 'mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){ res.locals.currentUser = req.user; next();})  

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
    favouritedBy: [mongoose.Schema.Types.ObjectId]
});

usersSchema.plugin(passportLocalMongoose);

var Users = mongoose.model ( "Users", usersSchema );
var Mushrooms = mongoose.model ( "Mushrooms", mushroomsSchema );

passport.use(Users.createStrategy());
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

app.get("/", function (req, res) {
    res.render("login")
});

var searched = false; 
var searched_input = ""; 

app.get( "/mainPage", async( req, res ) => {
    console.log("A user is accessing the reviews route using get, and...");
    if ( req.isAuthenticated() ){
        try {
            console.log( "was authorized and found:" );
            const mushrooms = await Mushrooms.find();
            res.render( "mainPage", {mushrooms : mushrooms, searched : searched, input : searched_input});
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

app.post( "/mushroomDisplay", async( req, res ) => {
    console.log("A user is accessing the reviews route using get, and...");
    if ( req.isAuthenticated() ){
        try {
            var mushrooms = await Mushrooms.find();
            var mushroom = await Mushrooms.findOne(ObjectId(req.body["mushroomid"]));
            res.render( "mushroomDisplay", {mushroom : mushroom, mushrooms : mushrooms, searched : searched, input : searched_input});
        } catch ( error ) {
            console.log( error );
        }
    } else {
        console.log( "was not authorized." );
        res.redirect( "/" );
    }
});

app.post("/searchMushroom", async( req, res ) => {
    if ( req.isAuthenticated() ){
    searched = true; 
    type = req.body["search_page"]; 
    mushroom = req.body["search_id"];
    
    searched_input = req.body["search_input"]; 
    console.log(type);
    if (searched_input == null || searched_input  == "")
    {
        mushrooms = await Mushrooms.find();
    }
    else 
    {
        console.log(searched_input);
        mushrooms = await Mushrooms.find({ $or: [{"name": new RegExp(searched_input,'i')}, 
                                            {"benefits": new RegExp(searched_input,'i')},
                                            {"symptoms": new RegExp(searched_input,'i')},
                                            {"facts": new RegExp(searched_input,'i')},] 
                                        });
    }
    if (type == "main" || mushroom ==null)
    {
        res.render("mainPage", {mushrooms : mushrooms, searched : searched, input : searched_input});
    }
    else
    {
        var mushroom = await Mushrooms.findOne(ObjectId(mushroom));
        res.render("mushroomDisplay", {mushroom : mushroom, mushrooms : mushrooms, searched : searched, input : searched_input});
    }
} else {
    console.log( "was not authorized." );
    res.redirect( "/" );
}
});

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

app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { 
          return next(err); 
      }
      res.redirect('/');
    });
  });

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
