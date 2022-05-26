const routes=require("express").Router()
const User=require("../models/User")
const CryptoJS=require("crypto-js")
const jwt=require("jsonwebtoken")

routes.post("/register", async (req,res)=>{
    const newUser= new User({
        username:req.body.username,
        email:req.body.email,
        password:CryptoJS.AES.encrypt(req.body.password,process.env.CRYPTOJS_KEY).toString()
    })

    try{
        const saved=await newUser.save()
        res.status(200).json(saved)
    }catch(err){
      res.status(500).json(err)
    }
})

routes.post("/login", async (req,res)=>{
  try{
    const user= await User.findOne({username:req.body.username})
  !user && res.status(400).json("invalid Email")

  const hashedPassword=CryptoJS.AES.decrypt(user.password,process.env.CRYPTOJS_KEY)
  const decryptPassword=hashedPassword.toString(CryptoJS.enc.Utf8)

  decryptPassword !==req.body.password && res.status(400).json("invalid Password")

  const accessToken=jwt.sign({
    id:user._id,
    isAdmin:user.isAdmin
  },process.env.JWT_KEY,{expiresIn:"3d"})

  const {password,...other}=user._doc
  
  res.status(200).json({...other,accessToken})
  }catch(err){
    res.status(500).json(err)
  }
})

module.exports=routes