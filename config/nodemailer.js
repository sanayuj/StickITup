const nodemailer=require('nodemailer');
require("dotenv").config()

const sendMail = async function (useremail,req) {
  let OTP = Math.floor(1000 + Math.random() * 8999);
  OTP = OTP.toString().padStart(4, "0");
  req.session.otp=OTP
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: process.env.ADMIN_EMAIL, // generated ethereal user
          pass: process.env.ADMIN_EMAIL_PASSWORD, // generated ethereal password
      },
  });

  let info = await transporter.sendMail({
      from: '"StickItUp" <stickitupecommerce@gmail.com>', // sender address
      to: useremail, // list of receivers
      subject:  'OTP  for to verify your stickitup account', // Subject line
      text: `Your OTP is: ${OTP}`, // plain text body
     


  });
}
    module.exports=sendMail;