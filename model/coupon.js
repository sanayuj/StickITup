const mongoose=require("mongoose")

const couponSchema=new mongoose.Schema({
    couponCode:{
        type:String,
        require:true
    },
    expriryDate:{
        type:String,
        require:true,
    },
    maxDiscount:{
        type:Number,
        require:true,
    },
    minAmount:{
        type:Number,
        require:true
    },
    maxAmount:{
        type:Number,
        require:true
    }
    

})

module.exports=new mongoose.model("coupons",couponSchema)