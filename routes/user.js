var express = require("express");
const controller = require("../controller/user_control");
const adminController = require("../controller/admin_control");
var router = express.Router();
const verify = require("../config/nodemailer");
const { response } = require("express");
const sendmail = require("../config/nodemailer");
const { Collection } = require("mongoose");

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
router.post("/otpverification", (req, res) => {
  const otp = parseInt(req.session.otp);
  const userOtp = parseInt(req.body.otp);
  controller.verifyOtp(userOtp, otp).then((response) => {
    if (response.status) {
      controller.changeverifiedStatus(req.session.UserId).then(() => {
        res.json({ status: true });
      });
    } else {
      res.json({ status: false });
    }
  });
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

router.get("/product-singlepage/:id", (req, res) => {
  const id = req.params.id;
  controller.productView(req.params.id).then((response) => {
    const productdetails = response;
    const user = req.session.user;
    res.render("user/user_homepage/singleproduct", { user, productdetails });
  });
});

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
    req.session.UserId = response.data._id;
    if (response.exist) {
      req.session.existed = true;
      res.redirect("/user_signup");
    } else {
      const useremail = req.body.email;
      sendmail(useremail, req);
      res.render("user/user_homepage/otp");
    }
  });
});

//wishlist


router.get("/whistlistPage",verifyLogin,(req,res)=>{
  res.render("user/user_homepage/wishlist")
})


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

// //checkout

router.get("/checkout", verifyLogin, async (req, res) => {
  const userproduct = await controller.getcartItem(req.session.user._id);
  const userproducts = userproduct.cartProducts;
  const userAddress = await controller.showAddress(req.session.user._id);
  const totalAmount = await controller.totalAmount(req.session.user._id);
  res.render("user/user_homepage/checkoutSection", {
    userproduct,
    totalAmount,
    user: req.session.user,
    userproducts,
    userAddress,
  });
});

//address page

router.get("/checkoutaddressPage", verifyLogin, (req, res) => {
  res.render("user/user_homepage/addressCheckout");
});

//add address

router.post("/checkoutForm", verifyLogin, async (req, res) => {
  controller.addAddress(req.session.user._id, req.body);
  res.redirect("/checkout");
});

//cod order

router.post("/place-order", verifyLogin, async (req, res) => {
  const cartProducts = await controller.getcartItem(req.session.user._id);
  const cartProduct = await cartProducts.productdetails;
  const totalAmount = await controller.totalAmount(req.session.user._id);
  controller
    .placeOrder(req.session.user._id, req.body, cartProduct, totalAmount)
    .then((orderId) => {
      req.session.OrderId = orderId;
      if (req.body["payment-method"] === "COD") {
        res.json({ success: true });
      } else {
        controller.generateRazorpay(orderId, totalAmount).then((response) => {
          const user = req.session.user;
          res.json(response);
        });
      }
    });
});

//order sucesspage

router.get("/ordersuccess", verifyLogin, async (req, res) => {
  await controller.deleteCart(req.session.user._id);
  const userOrder = await controller.viewcurrentOrder(req.session.OrderId);
  res.render("user/user_homepage/orderSucess", {
    user: req.session.user,
    userOrder,
  });
});

//user profile

router.get("/userProfile", verifyLogin, (req, res) => {
  res.render("user/user_homepage/userprofile", { user: req.session.user });
});

router.get("/orderDetails", verifyLogin, async (req, res) => {
  const orderDetails = await controller.viewOrderDetails(req.session.user._id);
  res.render("user/user_homepage/orderView", {
    orderDetails,
    user: req.session.user,
  });
});

router.post("/verify-payment", async (req, res) => {
  const orderid = req.body["order[receipt]"];
  await controller
    .verifypayment(req.body)
    .then(() => {
      controller.changeStatus(orderid).then(() => {
        res.json({ paymentsuccess: true });
      });
    })
    .catch((err) => {
      res.json({ paymentsuccess: false });
    });
});

router.post("/edituserdetails", async (req, res) => {
  const editedDetails = await controller.editUserdetails(
    req.session.user._id,
    req.body
  );
  res.redirect("/userProfile");
});

//change password in user profile

router.get("/changepassword", verifyLogin, (req, res) => {
  res.render("user/user_homepage/changePassword", {
    passwordErr: req.session.passErr,
  });
  req.session.passErr = false;
});

router.post("/resetpassword", verifyLogin, async (req, res) => {
  const data = await controller.changepassword(req.body, req.session.user._id);
  if (data.status) {
    res.json({ status: true });
  } else {
    req.session.passErr = true;
    res.json({ status: false });
  }
});
module.exports = router;
