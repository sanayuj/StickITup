var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/admin_login', function(req, res, next) {
  res.render('adminPage/login');
});

router.get('/admin_homepage',function(req,res,next){
  res.render('adminPage/admin_dashboard')
})

router.post('/admin_homepage',function(req,res,next){
  
})

module.exports = router;
