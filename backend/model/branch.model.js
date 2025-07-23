const mongo=require("mongoose");
const {Schema} =mongo;
const bcrypt=require("bcrypt");

const branchSchema=new Schema(
    {
branchName :{
    type:String,
    uniqur:true
},
key:String,
branchAddress     : String,
    },{timestamps:true}
);

module.exports=mongo.model("branch",branchSchema);