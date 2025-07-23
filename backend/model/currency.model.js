const mongo=require("mongoose");
const {Schema} =mongo;
const bcrypt=require("bcrypt");

const currencySchema=new Schema(
    {
currencyName :{
    type:String,
    uniqur:true
},
key:String,
currencyDesc : String,
    },{timestamps:true}
);

module.exports=mongo.model("currency",currencySchema);