const admin=require('../model/adminmodel')
const bcrypt = require('bcrypt')

module.exports={
    doadminloggin:(admindata)=>{
        // let {email, password} = admindata
        // console.log(email,"kkkkkk");
        console.log(admindata,"admincontroll varify")
        console.log(admindata.email);
        return new Promise(async(resolve,reject)=>{


            try {
                // console.log(email)
                const adminDetails=await admin.findOne({email:admindata.email})
                //console.log(admindata.email,"suuuuuiii")
                console.log(adminDetails,'jjjjjj')
                if(adminDetails){
                    bcrypt.compare(admindata.password,adminDetails.password,(err,result)=>{
                        if(err)throw err;
                        if(result){
                           resolve({status:true,adminDetails})
                           console.log("sucess")
                        }else{
                            resolve({status:false })
                            console.log("failed")
                        }
                    })
                }else{
                    resolve({adminNotExist:true})
                }
            } catch (error) {
                throw error
            }
        })
    }

 
}