const nodemailer=require('nodemailer');
module.exports={
    otpGenerator:(userEmail)=>{
        return new promises((req,res)=>{
            let otp=parseInt(Math.random()*1000000)
            let mailOptions = {
                from: "stickitup@gmail.com",
                to: userEmail,
                subject: "OTP for user verification",
                text: `hello, ${otp} is your stickitup verification code`
              }
              let transporter = nodemailer.createTransport({
                
                service:'gmail',
                auth: {
                  user: process.env.ADMIN_EMAIL, 
                  pass: process.env.ADMIN_EMAIL_PASSWORD, 
                },
              });
              transporter.sendMail(mailOptions,function(error,info){
                if(error){
                    resolve({status:false})
                }else{
                    resolve({status:true,otp})
                }
              })
        })
    }
}