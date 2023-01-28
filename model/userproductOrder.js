const mongoose=require("mongoose")
const orderSchema= new mongoose.Schema({
userId:{
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
        ref:"product"
    },
    quantity:{
        type:Number,
        required:true
    },
    productprize:{
        type:Number,
    },
    totalamount:{
        type:Number
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