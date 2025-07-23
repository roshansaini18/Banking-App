require("dotenv").config();
const nodemailer=require("nodemailer");

const sendEmail=(req,res)=>{
const {email,password}=req.body;
const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.ADMIN_EMAIL,
        pass:process.env.ADMIN_EMAIL_PASSWORD
    }
});

const emailTemplate=`
Dear Customer,

Thank you for registering with Stack Overflow Bank. We are pleased to provide you with your login credentials. Please find your account details below:

Username: ${email}
Password: ${password}

Kindly ensure that this information is kept confidential and is not shared with anyone. For your security, we recommend changing your password upon first login.

If you attempt to withdraw from an empty stack, please contact our support team.

Sincerely,
Stack Overflow Bank
`

const mailOption={
    from:process.env.ADMIN_EMAIL,
    to:email,
    subject:"Account Login Credentials",
    text:emailTemplate
}

transporter.sendMail(mailOption,(err,info)=>{
    if(err){
       return res.status(500).json({
        message:"Sending failed!",
        emailSend:false
       })
    }
     res.status(200).json({
        message:"Sending success!",
        emailSend:true
       })
})
}

module.exports={
    sendEmail
}