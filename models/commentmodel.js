var mang = require("mongoose");
var commentSchema = new mang.Schema({
    text: String,
    author: {
        id : {
            type : mang.Schema.Types.ObjectId,
            ref : "User"
        },
        username : String
    }
});
var Comment = mang.model("Comment", commentSchema);
module.exports  = Comment; 
