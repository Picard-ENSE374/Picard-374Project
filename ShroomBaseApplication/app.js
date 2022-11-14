const express = require ( "express" );
const session = require("express-session")
const mongoose = require( 'mongoose' );
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

const tasksSchema = new mongoose.Schema (
    {
    text: String,
    state: String,
    creator: String,
    isTaskClaimed: Boolean,
    claimingUser: String,
    isTaskDone: Boolean,
    isTaskCleared: Boolean
    }
);

usersSchema.plugin(passportLocalMongoose);

var Users = mongoose.model ( "Users", usersSchema );
var Tasks = mongoose.model ( "Tasks", tasksSchema );

passport.use(Users.createStrategy());
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

app.get("/", function (req, res) {
    res.render("login")
});

app.get( "/mainPage", async( req, res ) => {
    console.log("A user is accessing the reviews route using get, and...");
    if ( req.isAuthenticated() ){
        try {
            console.log( "was authorized and found:" );
            const tasks = await Tasks.find();
            console.log( tasks );
            res.render( "mainPage", { tasks : tasks });
        } catch ( error ) {
            console.log( error );
        }
    } else {
        console.log( "was not authorized." );
        res.redirect( "/" );
    }
});

app.get( "/mushroomDisplay", async( req, res ) => {
    console.log("A user is accessing the reviews route using get, and...");
    if ( req.isAuthenticated() ){
        try {
            console.log( "was authorized and found:" );
            const tasks = await Tasks.find();
            console.log( tasks );
            res.render( "mushroomDisplay", { tasks : tasks });
        } catch ( error ) {
            console.log( error );
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