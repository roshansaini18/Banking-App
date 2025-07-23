require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res) => {
      const raw = req.headers.authorization;
    if (!raw) return res.status(401).send("No token");

    const token = raw.replace("Bearer", "");
    if(!token){
        return {
            message:"There is no token !",
            isVarified:false
        }
    }

    try{
        const decoded=await jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        return {
            message:"Token verified !",
            isVarified:true,
            data:decoded
        }
    }
    catch(error){
         return {
            message:"There is no token !",
            isVarified:false,
            error
        }
    }
};

module.exports = { verifyToken };
