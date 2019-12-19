var yelp = require("../models/yelpmodel");
var Comment = require("../models/commentmodel");

var middlewareObj = {};

middlewareObj.isLoggedIn = function (req,res,next){
    if(req.isAuthenticated()){
        return next();
    }  
    req.flash("error","U must login first");  
    res.redirect("/login");
}

middlewareObj.isLoggedOut = function (req,res,next){
    if(req.isAuthenticated()){
        return res.redirect("back");
    }    
    return next();
}
middlewareObj.checkUserCamp = function(req,res,next){
    if(req.isAuthenticated()){
        yelp.findById(req.params.id,function(err,myelp){
            if(!err){
                if(myelp.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    res.send("You dont have permission");
                }
            }
        })
    }
    else{
        res.send("U must Login First");
    }
}

middlewareObj.checkUserComment = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.c_id,function(err,fcomment){
            if(!err){
                if(fcomment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    res.send("U have no permission to do this");
                }
            }
        })
    }
    else{
        res.send("U must first login");
    }
}

module.exports = middlewareObj;