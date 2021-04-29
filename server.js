const express = require('express');
const cors = require('cors');
const model = require('./model');

const session = require('express-session');
const passport = require('passport');
const passportLocal = require('passport-local');

const ColoringPage = model.ColoringPage;

const app = express();
//const port = 8585;
const port = process.env.PORT || 3000;

app.use(express.urlencoded({extended: false}));
app.use(cors({credentials: true, origin: 'null'}));

// TODO
// passport middleware
app.use(session({secret: SECRET, resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

// PASSPORT implementation
// 1. local strategy implementation
passport.use(new passportLocal.Strategy({
    // some configs
    usernameField: "email", // dj is using "email", don't get confused
    passwordField: "plainPassword" // these are the keys
}, function(email, plainPassword, done) {
    // done is a function that we call when done
    model.User.findOne({email: email}).then(function(user) {
        // verify that the user actually exists
        if (!user) { //fail - user doesn't exist
            console.log("failed at findOne");
            done(null, false); // no error and no user
            return;
        };
        // verify user's password
        user.verifyPassword(plainPassword, function(result) { // getting the result from callback from the verifyPassword in model.js
            if (result) { // user exists and the password matches
                console.log(result);
                done(null, user); // no error, yes user - pass on the user
            } else { // user exists but wrong password
                console.log("failed at verifyPassword");
                done(null, false); // there is an error but we're not handling that right now i guess
            }

        });
    }).catch(function(err) {
        console.log(err);
        done(err);
    });
})); // now we've taught passport how our database stuff works

// 2. serialize user to session - get the id and write it down
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

// 3. deserialize user from session - take the id and find the whole user
passport.deserializeUser(function(userId, done) {
    model.User.findOne({_id: userId}).then(function(user) {
        done(null, user);
    }).catch(function(err) {
        done(err);
    });
});

// 4. authenticate endpoint
app.post("/session", passport.authenticate("local"), function(req, res){
    // this function is called if authentication succeeds
    console.log("logged in!");
    res.sendStatus(201);
});

// 5. "me" endpoint
app.get("/session", function(req, res) {
    if (req.user) {
        // send user details
        console.log("current user:", req.user);
        res.json(req.user);
    } else {
        // send 401
        res.sendStatus(401);
    }
});


app.delete('/session', function (req, res) {
    req.logout();
    console.log("logged out!");
    res.sendStatus(200);
}); 



// const Favorite = mongoose.model('Favorite', {
//     title: String,
//     description: String,
//     image: String
// });
app.get('/favorites', (req, res) => {
    // res.setHeader("Access-Control-Allow-Origin", "*");
    if (!req.user) {
        res.sendStatus(401);
        return;
    };
    console.log("req.user", req.user);
    if (req.user.email == "admin") {
        model.Favorite.find().populate('user').then( (favorites) => {
            console.log("favorites from the db: ", favorites);
            res.json(favorites);
        });
    } else {
        var filter = {
            user: req.user.id // only show ones this user created
        };
        model.Favorite.find(filter).populate('user').then( (favorites) => {
            console.log("favorites from the db: ", favorites);
            res.json(favorites);
        });
    };
    // if you wanna do some filtering, you can specify an attribuite in the .find()
    //model.Favorite.find({ sauce: "bbq"})
    // can sort too
    //model.Favorite.find({ sauce: "bbq"}).sort('size')

    // can send things in the query so the find can be dynamic
    // var filter = {};
    // if (req.query.sauce) {
        // filter.sauce = req.query.sauce
    // }
    //model.Pizza.find({ sauce: filter}) 
    // everything before the question mark in the url is params, anything after is query

});
app.post('/favorites', (req, res) => {
    if (!req.user) {
        res.sendStatus(401);
        return;
    };
    var favorite = new model.Favorite({ 
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        user: req.user._id
     });
    favorite.save().then(() => {
        console.log('yay new favorite');
        // res.setHeader("Access-Control-Allow-Origin", "*");
        res.sendStatus(201);
    }).catch(function(err) {
        console.log("oops ", err);
        if (err.errors) {
            // mongoose validation failure
            var messages = {};
            for (var error in err.errors) {
                messages[error] = err.errors[error].message;
            };
            res.status(422).json(messages);

        } else {
            // some other probably worse failure
            res.sendStatus(500); // generic server fail
        }
    });
});
app.get('/favorites/:favoriteId', (req,res) => {
    model.Favorite.findOne({ _id: req.params.favoriteId }).then((favorite) => {
        // res.set("Access-Control-Allow-Origin", "*");
        if (favorite) {
            res.json(favorite);
        };
        res.sendStatus(404);
    }).catch((err) => {
        console.log(err);
    })
});
//update existing favorite member
app.put('/favorites/:favoriteId', (req,res) => {
    if (!req.user) {
        res.sendStatus(401);
        return;
    };
    model.Favorite.findOne({ _id: req.params.favoriteId }).then((favorite) => {
        // res.set("Access-Control-Allow-Origin", "*");
        if (favorite && favorite.user.equals(req.user._id)) { // if there's a favorite and you are the creator of it
        // you gotta use .equals instead of == because they're objects not strings
        // could also turn them into strings
            favorite.title = req.body.title;
            favorite.description = req.body.description;

            favorite.save().then(() => {
                console.log('yay updated favorite');
                // res.set("Access-Control-Allow-Origin", "*");
                res.sendStatus(200);
            })
            // might have to turn this off
            .catch((err) => {
                res.sendStatus(500);
            })
        
        } else {
            res.sendStatus(404);
        }
        
    }).catch(function(err) {
        console.log("oops ", err);
        if (err.errors) {
            // mongoose validation failure
            var messages = {};
            for (var error in err.errors) {
                messages[error] = err.errors[error].message;
            };
            res.status(422).json(messages);

        } else {
            // some other probably worse failure
            res.sendStatus(500); // generic server fail
        }
    });
});
// delete existing pizza member
app.delete('/favorites/:favoriteId', (req,res) => {
    model.Favorite.findOne({ _id: req.params.favoriteId }).then((favorite) => {
        console.log("delete ", favorite, " request from", req.user.email);
        if (favorite && favorite.user.equals(req.user._id) || req.user.email == "admin") {
            favorite.delete().then(() => {
                console.log('yay deleted favorite');
                res.sendStatus(200);
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500);
            })
        
        } else {
            res.sendStatus(404);
        }
       
    }).catch((err) => {
        res.sendStatus(400);
    })
});





// model.User.find()? 
app.get('/users', (req, res) => {
    model.User.find().then( (users) => {
        console.log("users from the db: ", users);
        res.json(users);
    })
});

app.post('/users', (req, res) => {
    console.log("called POST users", req.body.email, req.body.fName, req.body.lName, req.body.plainPassword);
    var user = new model.User({ 
        email: req.body.email,
        firstName: req.body.fName,
        lastName: req.body.lName,
        plainPassword: req.body.plainPassword
     });

    console.log(user);

    user.setEncryptedPassword(req.body.plainPassword, function () {
        // Store hash in your password DB.
        // user.encryptedPassword = hash;
        user.save().then(() => {
            console.log('user created');
            // res.setHeader("Access-Control-Allow-Origin", "*"); cors will do it now
            res.sendStatus(201);
        }).catch(function (err) {
            if (err.errors) {
                var messages = {};
                for (var e in err.errors) {
                    messages[e] = err.errors[e].message
                };
                res.status(422).json(messages);
                // yikes
            } else if (err.code == 11000){
                res.status(422).json({
                    email: "Already registered"
                });
            } else {
                res.sendStatus(500);
                console.log("Unknown error occurred: ", err);
            }
        });
    });

    // res.setHeader("Access-Control-Allow-Origin", "*");
    // res.sendStatus(201);
});

app.delete('/users/:userId', (req, res) => {
    model.User.findOne({ _id: req.params.userId }).then((baduser) => {
        console.log("delete ", baduser, " request from", req.user.email);
        if (req.user.email == "admin") {
            baduser.delete().then(() => {
                console.log('yay deleted user');
                res.sendStatus(200);
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500);
            })
        
        } else {
            res.sendStatus(404);
        }
       
    }).catch((err) => {
        res.sendStatus(400);
    })
})


app.listen(port, () => {
    console.log("listening at localhost:", port);
});