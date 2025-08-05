const mongo=require("mongoose");
const {Schema} =mongo;
const bcrypt=require("bcrypt");

const usersSchema=new Schema(
    {
        fullName:String,
        mobile:String,
        email:{
            type:String,
            unique:true
        },
        password:String,
        profile:String,
        key:String,
        address:String,
        branch : String,
        userType:String,
        isActive:{
            type:Boolean,
            default:false
        },
         passwordResetOTP: {
    type: String,
    required: false // This field is not required for every user, only when they request a reset
  },
  passwordResetExpires: {
    type: Date,
    required: false
  }

    },{timestamps:true}
);
usersSchema.pre("save",async function(next){
    const user=this;
    if(!user.isModified("password")){
        return next();
    }
    const salt=await bcrypt.genSalt(10);
    user.password=await bcrypt.hash(user.password,salt);
})

module.exports=mongo.model("user",usersSchema);
