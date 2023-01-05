var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/admin_login', function(req, res, next) {
  res.render('adminPage/login');
});

module.exports = router;
