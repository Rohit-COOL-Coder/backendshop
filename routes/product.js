const Product = require("../models/Product")
const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("./verifyToken")

const routes=require("express").Router()
// ADD PRODUCT
routes.post("/add",verifyTokenAndAdmin, async (req,res)=>{
    const product= new Product(req.body)
    try{
       const data=await product.save()
      res.status(200).json(data)
    }catch(err){
        res.status(500).json(err)
    }
})
// GET PRODUCT
routes.get("/find/:id",async(req,res)=>{
   try{
       const product=await Product.findById(req.params.id)
       res.status(200).json(product)
   }catch(err){
       res.status(500).json(err)
   }
})
//UPDATE PRODUCT
routes.put("/:id",verifyTokenAndAdmin,async (req,res)=>{
    try{
        const updateProduct=await Product.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json(updateProduct)
    }catch(err){
        res.status(500).json(err)
    }
})

//DELETE PRODUCT
routes.delete("/:id",verifyTokenAndAdmin,async (req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Succesfully deleted.....")
    }catch(err){
        res.status(500).json(err)
    }
})

//GET ALL PRODUCT
routes.get("/", async (req,res)=>{
   const qNew=req.query.new
   const qCategory=req.query.category
   let product 
   try{
        if(qNew){
          product=await Product.find().limit(1)
        }else if(qCategory){
           product=await Product.find({
               categories:{
                   $in:[qCategory]
               }
           })
        }else{
            product=await Product.find()
        }

          
           res.status(200).json(product)
    }catch(err){
        res.status(500).json(err)
    }
})


module.exports=routes