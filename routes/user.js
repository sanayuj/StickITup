var express = require("express");
const { response } = require("../app");
const dbConnect = require("../config/connection");
const controller = require("../controller/user_control");
const adminController = require("../controller/admin_control");
var router = express.Router();

const verifyLogin=(req,res,next)=>{
if(req.session.loggedin){
next()
}else{
  res.redirect("/user_login")
}
}


router.get("/user_login", function (req, res, next) {
  if (req.session.loggedin) {
    res.redirect("/");
  } else {
    res.render("user/user_loginForm/login", {
      usernotExist: req.session.usernotExist,
      pass: req.session.passwordErr,
      blockpass: req.session.userBlocked,
    });
    req.session.usernotExist = false;
    req.session.userBlocked = false;
    req.session.passwordErr = false;
  }
});
router.get("/user_otp", function (req, res, next) {
  res.render("user/user_otpForm/otp1");
});

router.get("/user_1otp", function (req, res, next) {
  res.render("user/user_otpForm/otp2");
});

router.get("/user_2otp", function (req, res, next) {
  res.render("user/user_otpForm/otp3");
});

router.get("/user_signup", function (req, res, next) {
  res.render("user/user_loginForm/signup");
});

router.get("/", async function (req, res, next) {
  await adminController.listProduct().then((data) => {
    const product = data;
    const productdata = product.map((product) => {
      return {
        _id: product._id,
        name: product.name,
        price: product.price2,
        price1: product.price1,
        image: product.imageurl[0].filename,
      };
    });
    let user = req.session.user;
    // console.log(user);
    res.render("user/user_homepage/homepage", { user, productdata });
    //console.log(user)
    req.session.passwordErr = false;
    req.session.usernotExist = false;
  });
});
//cart
router.get("/cart",verifyLogin,(req,res)=>{
  console.log("cart page ");
  res.render("user/user_homepage/cartpage")
})
//add to cart
router.get("/addtocart/:productID",verifyLogin, (req, res) => {
  controller
    .addtoCart(req.session.user._id, req.params.productID)
    .then((data) => {});
  res.redirect("/");
});

//logout router
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

//
// user post section

router.post("/user_signup", function (req, res, next) {
  if (response.exist) {
    res.redirect("/user_signup");
  } else {
    controller.doSignup(req.body);
    res.redirect("/user_login");
  }
});

router.post("/user_login", (req, res, next) => {
  controller.doLogin(req.body).then((response) => {
    if (response.emailidNotExist) {
      req.session.usernotExist = true;
      console.log(req.session.usernotExist);
      res.redirect("/user_login");
    } else {
      if (response.blockedUser) {
        req.session.userBlocked = true;

        res.redirect("/user_login");
      } else if (response.status) {
        req.session.loggedin = true;
        req.session.user = response.user;

        res.redirect("/");
      } else {
        req.session.passwordErr = true;
        res.redirect("/user_login");
      }
    }
  });
});

module.exports = router;
