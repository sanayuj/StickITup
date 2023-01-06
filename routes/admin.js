const adminController=require('../control/admin_control')
var express = require('express');
const { response } = require('../app');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('adminPage/login');
});

router.get('/admin_homepage',function(req,res,next){
  res.render('adminPage/admin_dashboard')
})

router.post('/admin_login',function(req,res,next){
  //console.log(req.body)
adminController.doadminloggin(req.body).then((response)=>{
  if(response.status){
    req.session.adminloggedin=true
    req.session.user=response.adminDetails
 
     res.redirect('adminPage/admin_dashboard')
   }else{
     res.redirect('adminPage/login')
   }
})
})

module.exports = router;
