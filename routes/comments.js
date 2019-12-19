var express =require("express");
var router = express.Router({mergeParams : true});
var yelp = require("../models/yelpmodel");
var Comment = require("../models/commentmodel");
var middleware = require("../middleware");

router.get("/new",middleware.isLoggedIn,function(req, res) {
    yelp.findById(req.params.id, function(err, fcom) {
        if(!err) {
            console.log(fcom);
            res.render("comment/new",{fcom:fcom});
        }
        else {
            res.send(err)
        }
    });
});
router.get("/:c_id/edit",middleware.checkUserComment,function(req,res){
    Comment.findById(req.params.c_id,function(err,fcomment){
        if(!err){
            res.render("comment/edit",{camp_id : req.params.id , comment : fcomment});
        }
    })
})
router.post("/",middleware.isLoggedIn,function(req, res) {
    yelp.findById(req.params.id, function(err, fp) {
        if(!err) {
            Comment.create(req.body.com, function(err, ccom){
                ccom.author.id = req.user._id;
                ccom.author.username = req.user.username;
                ccom.save();
                fp.comments.push(ccom);
                fp.save(function(err, saved){
                   console.log(saved);
                   res.redirect("/campaign/" + req.params.id); 
                })
            })
            
        }
        else {
            res.send(err)
        }
    });
});
router.post("/:c_id",middleware.checkUserComment,function(req,res){
    var newComment = {
        text : req.body.text,
        author : {
            id : req.user._id,
            username : req.user.username
        }
    }
    Comment.findByIdAndUpdate(req.params.c_id,newComment,function(err,ucomment){
        if(!err){
            res.redirect("/campaign/" + req.params.id);
        }
    })
})
router.post("/:c_id/delete",middleware.checkUserComment,function(req,res){
    Comment.findByIdAndDelete(req.params.c_id,function(err){
        if(!err){
            res.redirect("/campaign/" + req.params.id);
        }
    })
})

 module.exports = router;