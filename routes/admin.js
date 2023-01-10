const adminController = require("../controller/admin_control");
var express = require("express");
const { response, render } = require("../app");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("adminPage/login");
});

router.get("/admin_homepage", function (req, res, next) {
  res.render("adminPage/admin_dash");
});

router.get("/admin_userlist", function (req, res) {
  adminController.getuserData().then((response) => {
    //console.log(response)
    if (response.status) {
      res.render("adminPage/admin_userlist", {
        userdetails: response.userdata,
      });
    } else {
      res.send(error);
    }
  });
});

router.get("/admin_logout", (req, res) => {
  res.redirect("/admin/");
  // req.session.destroy()
});

router.get("/block_user/:id", (req, res) => {
  adminController.blockUser(req.params.id).then((response) => {
    console.log(response.userId);
    console.log(req.params.id);
    res.redirect("/admin/admin_userlist");
  });
});
router.get("/unblock_user/:id", (req, res) => {
  console.log("Unblocked user");
  adminController.unblocUserk(req.params.id).then((response) => {
    res.redirect("/admin/admin_userlist");
  });
});
router.get("/admin_productadd", function (req, res) {
  res.render("adminPage/productAdd");
});

router.get('/addCategory',function(req,res){
  res.render("adminPage/category")
})
// admin post method section

router.post("/admin_login", function (req, res, next) {
  //console.log(req.body)
  adminController.doadminloggin(req.body).then((response) => {
    if (response.adminNotExist) {
      req.session.adminIDnotExist = true;
      console.log(req.session.adminIDnotExist);
      res.redirect("/admin/");
    } else {
      if (response.status) {
        req.session.adminloggedin = true;
        req.session.user = response.adminDetails;

        res.redirect("/admin/admin_homepage");
      } else {
        
        res.redirect("/admin/");
      }
    }
  });
}),
  (module.exports = router);
