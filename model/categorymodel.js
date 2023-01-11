const mongoose=require("mongoose")

const categorySchema= new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    image:{
        type:String,
        require:true
    }
})

module.exports=new mongoose.model("categories",categorySchema)