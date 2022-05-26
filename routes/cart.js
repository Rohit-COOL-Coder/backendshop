
const Cart = require("../models/Cart")
const { verifyTokenAndAdmin, verifyTokenAndAuthorization, verifyToken } = require("./verifyToken")

const routes=require("express").Router()

// ADD CART
routes.post("/add",verifyToken, async (req,res)=>{
    const cart= new Cart(req.body)
    try{
       const data=await cart.save()
      res.status(200).json(data)
    }catch(err){
        res.status(500).json(err)
    }
})
// GET CART
routes.get("/find/:id",verifyTokenAndAuthorization,async(req,res)=>{
   try{
       const cart=await Cart.findOne({userId: req.params.id})
       res.status(200).json(cart)
   }catch(err){
       res.status(500).json(err)
   }
})
//UPDATE CART
routes.put("/:id",verifyTokenAndAuthorization,async (req,res)=>{
    try{
        const updateCart=await Cart.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json(updateCart)
    }catch(err){
        res.status(500).json(err)
    }
})

//DELETE CART
routes.delete("/:id",verifyTokenAndAuthorization,async (req,res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Succesfully deleted.....")
    }catch(err){
        res.status(500).json(err)
    }
})

//GET ALL CART

routes.get("/",verifyTokenAndAdmin,async(req,res)=>{
    try{
       const carts=await Cart.find()
       res.status(200).json(carts)
    }catch(err){
        res.status(500).json(err)
    }
})


module.exports=routes