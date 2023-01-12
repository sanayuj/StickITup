const mongoose=require('mongoose')

const productSchema= new mongoose.Schema({
    name:{
        type:String ,
        require:true   
    },
    category:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    product_description:{
        type:String,
        require:true
    },
    
    size:{
        type:String,
        require:true
    },
    images:[{
        type:String,
        require:true
    }],
    stock:{
        type:Number,
        require:true
    }

})
module.exports=new mongoose.module("products",productSchema)