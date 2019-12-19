var express =require("express");
var passport = require("passport");
var router = express.Router();
var middleware = require("../middleware");

router.get("/",function(req,res) {
    res.render("land");
})
router.get("/register",middleware.isLoggedOut,function(req,res){
   res.render("logreg/register");
})
router.get("/login",middleware.isLoggedOut,function(req,res){
   res.render("logreg/login.ejs");
})
router.get("/logout",function(req,res){
   req.logout();
   req.flash("success","U logged out");
   res.redirect("back");
})

// router.post("/register",function(req,res){
//     bcrypt.hash(req.body.password, 10, function(err, hash) {
//         User.create({username: req.body.username , password : hash},function(err,user){
//             if(!err){
//                 res.redirect("/campaign");
//             }
//         })
//     });
// })

router.post("/register",passport.authenticate("local-register",{
    successFlash : true, 
    successRedirect : "/campaign",
    failureFlash : true,
    failureRedirect : "/login" 
}))

router.post("/login",passport.authenticate("local-login",{
   successFlash : true, 
   successRedirect : "/campaign",
   failureFlash : true,
   failureRedirect : "/login" 
}))

module.exports = router;