const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys.json');
const User = require('../mongo/models').models.User;

passport.serializeUser(function(user, done) {
    console.log('serializing user format : \n',user);
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    console.log("deserializing user id : "+id);
    User.findByKd(id, function(err, user) {
        done(err, user);
    });
});

passport.use( new googleStrategy({
    clientID : keys.clientID,
    clientSecret : keys.clientSecret,
    callbackURL : '/auth/google/redirect'
},(accessToken, refreshToken, profile, done) => {
    User.findByGoogleId({googleId: profile.id}).then((currentUser) => {
        if(currentUser){
            done(null, currentUser);
        } else {
            User.createNewUser({
                googleId:profile.id,
                username:profile.displayName
            })
                .then((newUser)=>{
                    done(null,newUser);
                })
        }
    });
}));


