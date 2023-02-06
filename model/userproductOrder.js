const mongoose=require("mongoose")
const orderSchema= new mongoose.Schema({
userid:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
},
address:{
    type:Object,
    required:true
},
paymentmethod:{
    type:String,
    required:true
},
orderitem:[{
    product:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"products"
    },
    quantity:{
        type:Number,
        required:true
    },
    productprize:{
        type:Number,
        required:true
    },
    totalamount:{
        type:Number,
        required:true
    }
}],
totalamount:{
    type:Number
},
status:{
    type:String,
    required:true
}
})

module.exports=new mongoose.model("orders",orderSchema)