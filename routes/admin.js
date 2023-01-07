const adminController=require('../control/admin_control')
var express = require('express');
const { response } = require('../app');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('adminPage/login');
});

router.get('/admin_homepage',function(req,res,next){
  res.render('adminPage/admin_dash.hbs')
})

router.get('/admin_userlist',function(req,res){
  adminController.getuserData().then((response)=>{
    //console.log(response)
    if(response.status){
      res.render('adminPage/admin_userlist',{userdetails:response.userdata})
    }else{
      res.send(error)
    }
  })
  
})

router.post('/admin_login',function(req,res,next){
  //console.log(req.body)
adminController.doadminloggin(req.body).then((response)=>{
  if(response.adminNotExist){
    req.session.adminIDnotExist=true
    console.log(req.session.adminIDnotExist)
    res.redirect('/admin/')
  }else{
    if(response.status){
      req.session.adminloggedin=true
      req.session.user=response.adminDetails
   
       res.redirect('/admin/admin_homepage')
     }else{
      // req.session.adminpasswordErr=true
       res.redirect('/admin/')
     }
    
  }
  
}),
router.get('/admin_logout',(req,res)=>{
 
  res.redirect('/admin/')
  req.session.destroy()
})
})

module.exports = router;
