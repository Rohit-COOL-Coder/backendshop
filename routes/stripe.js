const routes = require("express").Router()
const stripe = require("stripe")("sk_test_51KtIYSSBC8t0FW5KdWOOOpZnBGwQjxfSdbN5Af4oSyak67tTlzqUoRGlyCAoy3uDGbwD7iovspNBcfEr1gA6Ooq800e2foBnh0")
const { v4: uuidv4 } = require('uuid');

routes.post('/payment',(req,res)=>{
    console.log(req.body)
    const {token,amount}=req.body
    const idempotencyKey=uuidv4()

    return stripe.customers.create({
        email:token.email,
        source:token.id
    }).then(customer=>{
        stripe.paymentIntents.create({
            amount:amount,
            currency:'USD',
            customer:customer.id
        },{ idempotencyKey: idempotencyKey })
    }).then(result=>res.status(200).json(result))
    .catch(err=>console.log(err))
})

module.exports=routes
