const admin=require('../model/adminmodel')

module.exports={
    doadminloggin:(admindata)=>{
        //console.log(admindata,"admincontroll varify")
        return new Promise(async(resolve,reject)=>{
            try {
                let adminDetails=await admin.findOne({email:admindata.email})
                console.log(admindata.email,"suuuuuiii")
                console.log(adminDetails)
                if(adminDetails){
                    bcrypt.compare(admindata.password,adminDetails.password,(err,result)=>{
                        if(err)throw err;
                        if(result){
                            resolve({status:true,adminDetails})
                        }else{
                            resolve({status:false })
                        }
                    })
                }else{

                }
            } catch (error) {
                throw error
            }
        })
    }

 
}