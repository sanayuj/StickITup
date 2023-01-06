module.exports={
    doadminloggin:(admindata)=>{
        return new Promise(async(resolve,reject)=>{
            try {
                let adminDetails=await admin.findOne({email:admindata.email})
                console.log(admindata.email,"suuuuuiii")
                if(adminDetails){
                    bcrypt.compare(admindata.password,adminDetails.password,(err,result)=>{
                        if(err)throw err;
                        if(result){
                            resolve({status:true,adminDetails})
                        }else{
                            resolve({status:false })
                        }
                    })
                }
            } catch (error) {
                throw error
            }
        })
    }

 
}