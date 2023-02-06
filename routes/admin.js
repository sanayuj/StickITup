const adminController = require("../controller/admin_control");
var express = require("express");
const { response, render } = require("../app");
var router = express.Router();
var categoryimgupload = require("../utilities/imgUpload");

const verifyadminLogin = (req, res, next) => {
  if (req.session.adminloggedin) {
    next();
  } else {
    res.redirect("/admin/");
  }
};

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("adminPage/login");
});

router.get("/admin_homepage", verifyadminLogin, (req, res, next) => {
  res.render("adminPage/admin_dash");
});

router.get("/admin_userlist", verifyadminLogin, (req, res) => {
  adminController.getuserData().then((response) => {
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

router.get("/block_user/:id", verifyadminLogin, (req, res) => {
  adminController.blockUser(req.params.id).then((response) => {
    res.redirect("/admin/admin_userlist");
  });
});
router.get("/unblock_user/:id", verifyadminLogin, (req, res) => {
  adminController.unblocUserk(req.params.id).then((response) => {
    res.redirect("/admin/admin_userlist");
  });
});
router.get("/admin_productadd", (req, res) => {
  adminController.listCategory().then((category) => {
    res.render("adminPage/productAdd", { category });
  });
});

router.get("/addCategory", verifyadminLogin, (req, res) => {
  adminController.listCategory().then((category) => {
    res.render("adminPage/category", { category });
  });
});

router.get("/listproduct", verifyadminLogin, (req, res) => {
  adminController.listProduct().then((products) => {
    res.render("adminPage/productList", { products });
  });
});

// admin post method section

router.post("/admin_login", function (req, res, next) {
  adminController.doadminloggin(req.body).then((response) => {
    if (response.adminNotExist) {
      req.session.adminIDnotExist = true;

      res.redirect("/admin/");
    } else {
      if (response.status) {
        req.session.adminloggedin = true;
        req.session.admin = response.adminDetails;

        res.redirect("/admin/admin_homepage");
      } else {
        res.redirect("/admin/");
      }
    }
  });
}),
  router.post(
    "/addcategory",
    verifyadminLogin,
    categoryimgupload.single("image"),
    (req, res) => {
      adminController.addCategory(req.body, req.file).then((data) => {
        res.redirect("/admin/addCategory");
      });
    }
  );

router.post(
  "/addProduct",
  verifyadminLogin,
  categoryimgupload.array("productImage", 4),
  (req, res) => {
    adminController.addProduct(req.body, req.files).then((data) => {
      res.redirect("/admin/admin_productadd");
    });
  }
);

router.get("/orders",verifyadminLogin,async(req,res)=>{
  console.log("Order listed in admin!!!!");
  const order=await adminController.listOrder()
  res.render("adminPage/orderlist",{order})
})

module.exports = router;
