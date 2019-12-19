var express = require("express");
var router = express.Router();
var yelp = require("../models/yelpmodel");
var middleware = require("../middleware");

router.get("/",function(req,res) {
    yelp.find({}, function(err, fod) {
        data=fod;
        console.log("req.user  :   " + req.user)
        res.render("camp/camp",{data:data})
    });
});
router.get("/new",middleware.isLoggedIn,function(req,res) {
    res.render("camp/new");
});
router.get("/:id",function(req,res) {
    yelp.findById(req.params.id).populate("comments").exec(function(err, fyelp) {
        if(!err) {
            console.log(fyelp);
            res.render("camp/show",{fyelp:fyelp});
        }
        else {
            res.send(err)
        }
    });
});
router.get("/:id/edit",middleware.checkUserCamp,function(req,res){
    yelp.findById(req.params.id,function(err,camp){
        if(!err){
            res.render("camp/edit",{camp:camp});
        }
    })
})

router.post("/",middleware.isLoggedIn,function(req,res) {
    obj={
        name:req.body.name,
        image:req.body.image,
        desc:req.body.desc,
        author:{
            id:req.user._id,
            username:req.user.username
        }
    };
    console.log(req.body.image);
    yelp.create(obj,function(){
        res.redirect("/campaign");    
    });
});
router.post("/:id/edit",middleware.checkUserCamp,function(req,res){
    obj={
        name:req.body.name,
        image:req.body.image,
        desc:req.body.desc,
        author:{
            id:req.user._id,
            username:req.user.username
        }
    };
    yelp.findByIdAndUpdate(req.params.id,obj,function(err,uyelp){
        if(!err){
            res.redirect("/campaign/" + req.params.id);
        }
    })
})
router.post("/:id/delete",middleware.checkUserCamp,function(req,res){
    yelp.findByIdAndDelete(req.params.id,function(err,dyelp){
        if(!err){
            res.redirect("/campaign");
        }
    })
})

module.exports = router;
