const express= require("express")
const app=express()
const mongoose=require("mongoose")
const dotenv=require("dotenv")
const userRoutes=require("./routes/user")
const authRoutes=require("./routes/auth")
const productRoutes=require("./routes/product")
const cartRoutes=require("./routes/cart")
const orderRoutes=require("./routes/order")
const stripeRoutes=require("./routes/stripe")
const cors = require("cors")

dotenv.config()
app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URL).then(()=>{
console.log("DB Connection Succesfull")
}).catch((err)=>{
    console.log(err)
})

app.use("/api/users",userRoutes)
app.use("/api/auth",authRoutes)
app.use("/api/products",productRoutes)
app.use("/api/carts",cartRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/checkout",stripeRoutes)

app.listen(process.env.PORT || 5000,()=>{
    console.log("Port:5000 Server started...")
})
