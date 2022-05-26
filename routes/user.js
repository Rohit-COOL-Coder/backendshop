const {  verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken")
const CryptoJS=require("crypto-js")
const User = require("../models/User")
const routes=require("express").Router()

routes.put("/:id",verifyTokenAndAuthorization,async (req,res)=>{
    if(req.body.password){
        req.body.password=CryptoJS.AES.encrypt(req.body.password,process.env.CRYPTOJS_KEY).toString()
    }
    try{
        const updateData=await User.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json(updateData)
    }catch(err){
        res.status(500).json(err)
    }
})

//Delete
routes.delete("/:id",verifyTokenAndAuthorization,async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("Succesfully deleted.....")
    }catch(err){
        res.status(500).json(err)
    }
})
//GET User

routes.get("/find/:id",verifyTokenAndAdmin,async (req,res)=>{
   try{
    const user=await User.findById(req.params.id)
    const {password,...other}=user._doc
    res.status(200).json(other)
   }catch(err){
       res.status(500).json(err)
   }
})
//GET ALL USERS
routes.get("/",verifyTokenAndAdmin, async (req,res)=>{
   const query = req.query.new
    try{
           const users=query? await User.find().sort({_id:-1}).limit(2) :await User.find()
           res.status(200).json(users)
    }catch(err){
        res.status(500).json(err)
    }
})

routes.get("/stats",verifyTokenAndAdmin,async(req,res)=>{
    const date=new Date()
    const lastYear=new Date(date.setFullYear(date.getFullYear()-1))

  try{
    const data=await User.aggregate([
        {$match:{createdAt:{$gte:lastYear}}},
        {$project:{month:{$month:"$createdAt"}}},
        {$group:{_id:"$month",total:{$sum:1}}}
    ])
    res.status(200).json(data)
  }catch(err){
      res.status(500).json(err)
  }

})

module.exports=routes