const bcrypt = require("bcrypt");
const user = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//signup route handler
exports.signup= async (req,res)=>{
    try{
        //get data
        const{name,email,password,role}=req.body;
        //check if user already exists
        const existingUser = await user.findOne({email});
        
        if(existingUser){
           return res.status(400).json({
            success:false,
            message:"user already exist"
           })
        }
        //secure password
        let hashPassword;
        try{
            hashPassword= await bcrypt.hash(password,10);
        }
        catch(error){
            return res.status(500).json({
                success:false,
                message:"Error in hashing password",
            })
        }
        //create entry for user
        const users= await user.create({
            name,email,password:hashPassword,role
        })
        return res.status(200).json({
            success:true,
            message:'user create successfully',
        })


    }
    catch(error){
             console.log(error);
             return res.status(500).json({
                success:false,
                message:"user cann't be registered,please try again later"
             })
    }
}
//login router handler

exports.login= async(req,res) =>{
    try{
        const{email,password}=req.body;
        //validation on email and password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"please fill all the detail carefully"
            })
        }
        //check for registered user
        let userss = await user.findOne({email});
        //if not a registered user
        if(!userss){
            return res.status(401).json({
                success:false,
                message:"User is not registered"
            })
        }
        const payload={
            email:userss.email,
            id:userss._id,
            role:userss.role
            
        }
        //verify a password and generate a JWT token
        if(await bcrypt.compare(password,userss.password)){
            //password match
            let token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"2h"});

            userss = userss.toObject();
            userss.token= token;
            userss.password= undefined;
            console.log(userss);


            const options = {
                expires: new Date( Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                userss,
                message:"User logged in successfully"
            });
            // res.status(200).json({
            //     success:true,
            //     token,
            //     userss,
            //     message:"User logged in successfully without cookie"
            // })
        }
        else{
            return res.status(403).json({
                success:false,
                message:"Password Incorrect"
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"login failure",
        })
    }
}