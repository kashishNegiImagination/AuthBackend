//auth ,isStudent,isAdmin
const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.auth = (req ,res , next) =>{
    try{


        console.log("cookie",req.cookie.token);
        console.log("body", req.body.token);
        
        //extract JWT Token
        const token =req.cookie.token || req.body.token || req.header("Authorization").replace("Bearer ","") ;
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token not found / Token is missing"
            })
        }
        //verify the token
        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);

            req.user = decode;

        }catch(error){
                return res.status(401).json({
                    success:false,
                    message:"Token is invalid"
                })
        }
        next();
    }catch(error){
        return res.status(401).json({
            success:false,
            message:"something went wrong while verifying the token"
        })
    }
}

exports.isStudent = (req,res,next)=>{
    try{
        if(req.user.role!=="Student"){
            return res.status(401).json({
                success:false,
                message:"this the successive routes for students"
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"user role is not matching"
        })
    }
}
exports.isAdmin = (req,res,next) =>{
    try{
        if(req.user.role!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"this the protective routes for Admin"
            })
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"user role is not matching"
        })
    }
}