const port = process.env.PORT || 1000;
var exp=require("express");
var bp=require("body-parser");
var passport=require("passport");
var session = require("express-session");
var flash = require("req-flash");
var initializePassport = require("./config");
var app=exp();
initializePassport(passport);
app.use(exp.static("public"));
app.use(bp.urlencoded({extended: true}));
app.set("view engine","ejs");
var mang=require("mongoose");
mang.connect("mongodb://localhost:27017/yelp_app_v5",{ useNewUrlParser: true });

var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

app.use(session({
    secret : "Im ok",
    resave : false,
    saveUninitialized : false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    console.log("currentUser   " + req.user);
    res.locals.error = req.flash("error");
    res.locals.success =req.flash("success");
    next();
})

// seedDB();

app.use("/campaign",campgroundRoutes);
app.use("/campaign/:id/comment",commentRoutes);
app.use(indexRoutes);

app.listen(port);