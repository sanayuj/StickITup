const mongoose=require("mongoose")
const indianTime=new Date();
const options={timeZone:'Asia/Kolkate'}


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
},
OrdercreatedAt:{
    type:String,
    // default:indianTime.toLocaleString('IND',options)
},
monthinNo:{
type:String
}
})

module.exports=new mongoose.model("orders",orderSchema)