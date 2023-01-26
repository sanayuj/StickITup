var express = require("express");
const { response } = require("../app");
const dbConnect = require("../config/connection");
const controller = require("../controller/user_control");
const adminController = require("../controller/admin_control");
var router = express.Router();
const verify = require("../config/nodemailer");

const verifyLogin = (req, res, next) => {
  if (req.session.loggedin) {
    next();
  } else {
    res.redirect("/user_login");
  }
};

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

router.get("/user_signup", function (req, res, next) {
  res.render("user/user_loginForm/signup", { existed: req.session.existed });
});

router.get("/", async function (req, res, next) {
  const user = req.session.user;
  let cartcount = null;
  if (req.session.user) {
    cartcount = await controller.getcartCount(user._id);
  }

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
    res.render("user/user_homepage/homepage", { user, productdata, cartcount });
    req.session.passwordErr = false;
    req.session.usernotExist = false;
  });
});

//cart,product listing

router.get("/cart", verifyLogin, (req, res) => {
  const user = req.session.user;
  controller.getcartItem(req.session.user._id).then(async (response) => {
    const userproduct = response.productdetails;
    const totalAmount = await controller.totalAmount(req.session.user._id);

    res.render("user/user_homepage/cartpage", {
      userproduct,
      user,
      totalAmount,
    });
  });
});

//product single page

router.get("/product-singlepage/:id",(req,res)=>{
  const id=req.params.id
  controller.productView(req.params.id).then((response)=>{
    const productdetails=response
    const user=req.session.user
    res.render("user/user_homepage/singleproduct",{user,productdetails})
  })
  
})

//single product view



//add to cart

router.get("/addToCart/:productID", (req, res) => {
  controller
    .addtoCart(req.session.user._id, req.params.productID)
    .then((data) => {
      res.json({ status: true });
    });
});

//logout router

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

//delect cart

router.post("/removecartitem", (req, res) => {
  controller.removeCartitem(req.body).then((response) => {
    res.json(response);
  });
});

//cart quaninty increment and decrement

router.post("/change-product-quantity", (req, res) => {
  controller.changeproductquantity(req.body).then((response) => {
    res.json(response);
  });
});

//user signup

router.post("/user_signup", function (req, res) {
  controller.doSignup(req.body).then((response) => {
    if (response.exist) {
      req.session.existed = true;
      res.redirect("/user_signup");
    } else {
      res.redirect("/user_login");
    }

    // else {
    //   verify.otpGenerator(response.email).then((response) => {
    //     req.session.otp = response.otp;
    //     res.render("user/otp");
    //   });
    // }
  });
});
//wishlist

router.post("/wishlist/:productId", verifyLogin, (req, res) => {
  controller.addToWish(req.session.user._id, req.params.productId);
});

//user login

router.post("/user_login", (req, res, next) => {
  controller.doLogin(req.body).then((response) => {
    if (response.emailidNotExist) {
      req.session.usernotExist = true;

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

// router.post('/otp-check',(req,res)=>{
//   otp=req.body.otp
//   user=req.session.user
//   if(otp==req.session.otp){
//     controller.doSignup(userdata).then((response)=>{
//       res.redirect('/user_login')
//     })
//   }else{
//     req.session.otpError=true
//     res.render("user/otp",{otpErr:req.session.otp})
//     req.session.otpError=false
//   }

// })

// //checkout

router.get("/checkout",verifyLogin,async(req,res)=>{
  res.render("user/user_homepage/checkout")
})

module.exports = router;
