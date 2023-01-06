const adminController=require('../control/admin_control')
var express = require('express');
const { response } = require('../app');
var router = express.Router();


/* GET users listing. */
router.get('/admin_login', function(req, res, next) {
  res.render('adminPage/login');
});

router.get('/admin_homepage',function(req,res,next){
  res.render('adminPage/admin_dashboard')
})

router.post('/admin_homepage',function(req,res,next){
adminController.doadminloggin(req.body).then((response)=>{
  if(response.status){
    req.session.loggedin=true
    req.session.user=response.adminDetails
 
     res.redirect('/homepage')
   }else{
     res.redirect('/user_login')
   }
})
})

module.exports = router;
