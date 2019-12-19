var mang=require("mongoose");
var yelpSch=new mang.Schema({
    name: String,
    image: String,
    desc: {type:String, default: "No Description"},
    author: {
        id: {
            type: mang.Schema.Types.ObjectId,
            ref: "User"
        },
        username : String
    },
    comments: [
        {
           type: mang.Schema.Types.ObjectId,
           ref: "Comment"
        }
    ]
});
var yelp=mang.model("yelp",yelpSch);
module.exports=yelp;