const mongoose  = require("mongoose");
const bcrypt=require('bcrypt')
    const userSchema=new mongoose.Schema({
        name:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            index:{unique:true}
        },
        password:{
            type:String,
            required:true
        },
        blocked:{
            type:Boolean,
            default:false
        }
    })
userSchema.pre('save', async function(next){
   try{
    const salt=await bcrypt.genSalt(10)
    const hashedpassword=await bcrypt.hash(this.password,salt)
    this.password=hashedpassword
    // console.log(this.password,this.email,"kooooi")
    next()
   }catch(error){
    next(error)
   }
})

module.exports=new mongoose.model("userlist",userSchema)