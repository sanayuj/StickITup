const dbConnect = require('../config/connection')
const userslist = require('../model/usermodel');
const bcrypt=require('bcrypt')
module.exports={
    doSignup:(userdata)=>{
         console.log(userdata,"HIIIIIIII")
        return new Promise(async(resolve,reject)=>{
            try{
                const newUser=userslist({
                    name:userdata.name,
                    email:userdata.email,
                    password:userdata.password
                })
                return await newUser.save()
                .then((data)=>{
                    resolve({status:true,data})
                })
            .catch((err)=>{
                resolve({status:false})
            })

        }
       catch(err){
        throw err;
       }
        
    })

    },
    doLogin:(userdata)=>{
        return new Promise(async(resolve,reject)=>{
            try {
                let user=await userslist.findOne({email:userdata.email})
                // console.log(userdata.email)
                if(user){
                    bcrypt.compare(userdata.password,user.password,(err,result)=>{
                        if(err)throw err;
                        if(result){
                            resolve({status:true,user})
                        }else{
                            resolve({status:false })
                        }
                    })
                }else{
                    //console.log("ahahhah")
                    resolve({emailidNotExist:true})
                }
            } catch (error) {
                throw error
            }
        })
    }
}