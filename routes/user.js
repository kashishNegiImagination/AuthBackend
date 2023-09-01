const express= require("express");
const router= express.Router();

const{login,signup} = require("../controller/auth");
const{auth,isStudent,isAdmin} = require("../middlewares/auth");

router.post("/login", login);
router.post("/signup", signup);


//test protected routes for single middleware:
router.get("/test", auth, (req,res)=>{
    res.json({
     success:true,
     message:"welcome to the protected routes for TEST",
    })
 })
//protected routes:
router.get("/student", auth, isStudent,(req,res)=>{
    res.json({
     success:true,
     message:"welcome to the protected routes for students",
    })
 })
 router.get("/admin", auth, isAdmin,(req,res)=>{
    res.json({
     success:true,
     message:"welcome to the protected routes for admin",
    })
 })



module.exports= router;