var localStrategy = require("passport-local").Strategy;
var bcrypt = require("bcryptjs");
var User = require("./models/usermodel");
var getUserbyUsername =async function(username){
    var user1;
    await User.findOne({ username : username } , function(err, user){
        if(!err){
            user1 = user;
        }
    })
    return user1;
}
var getUserbyId = async function(id){
    var user1;
    await User.findById(id,function(err,user){
        if(!err){
            user1 = user;
        }
    })
    return user1;
}
var initialize = function(passport){
    var authenticateUserLogin = async function(req,username, password, done){
        
        var user = await getUserbyUsername(username);
        if(!user){
            return done(null, false, { message : "Username doesn't exist"});
        }
        bcrypt.compare(password, user.password, function(err, res) {
            if(err){
                return done(err);
            }
            if(res){
                return done(null, user, { message : "Welcome to YelpCamp " + username});
            }
            return done(null, false, { message : "Password incorrect"});
        });
    }
    var authenticateUserRegister = async function(req,username, password, done){        
        var user = await getUserbyUsername(username);
        if(user){
            return done(null, false, { message : "Username already exist"});
        }
        bcrypt.hash(password, 10, function(err, hash) {
            if(!err){
                User.create({username: username , password : hash},function(err,user1){
                    if(!err){
                        done( null, user1, { message : "Welcome to YelpCamp " + username})
                    }
                })
            }
            else{
                return done(err);
            }
        })
    }
    passport.use('local-login',new localStrategy({
        passReqToCallback:true
    },
    authenticateUserLogin));
    passport.use("local-register", new localStrategy({
        passReqToCallback : true },
    authenticateUserRegister));
    passport.serializeUser(function(user,done){
        done(null, user._id);
    })
    passport.deserializeUser(async function(id,done){
        done(null, await getUserbyId(id));
    })
}

module.exports = initialize;