var express = require('express');
const { response } = require('../app');
const dbConnect =require('../config/connection')
const  controller = require('../control/user_control');
var router = express.Router();

/* GET home page. */
router.get('/user_login', function(req, res, next) {
  if(req.session.loggedin){
    res.redirect('/')
  }else{
    res.render('user/user_loginForm/login',{usernotExist:req.session.usernotExist,pass:req.session.passwordErr});
  }
  
});
router.get('/user_otp',function(req,res,next){
  res.render('user/user_otpForm/otp1')
});

router.get('/user_1otp',function(req,res,next){
  res.render('user/user_otpForm/otp2')
});

router.get('/user_2otp',function(req,res,next){
  res.render('user/user_otpForm/otp3')
});

router.get('/user_signup',function(req,res,next){
  res.render('user/user_loginForm/signup')
});

router.post('/user_signup',function(req,res,next){
console.log(req.body,"user data gotted")
controller.doSignup(req.body)
res.redirect('/user_login')
})

router.get('/',function(req,res,next){
  let user=req.session.user
  console.log(user)
  res.render('user/user_homepage/homepage',{user})
  req.session.passwordErr=false
  req.session.usernotExist=false
});

router.post('/user_login',(req,res,next)=>{
controller.doLogin(req.body).then((response)=>{
  if(response.emailidNotExist){
    req.session.usernotExist=true
    console.log(req.session.usernotExist)
    res.redirect('/user_login')
  
  }else{
   console.log(response.user)
  if(response.status){
   req.session.loggedin=true
   req.session.user=response.user

    res.redirect('/')
  }else{
    req.session.passwordErr=true
    res.redirect('/user_login')
  }
}
})

});

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})
module.exports = router;
