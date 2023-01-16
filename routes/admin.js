const adminController = require("../controller/admin_control");
var express = require("express");
const { response, render } = require("../app");
var router = express.Router();
var categoryimgupload = require("../utilities/imgUpload");

const verifyadminLogin=(req,res,next)=>{
  if(req.session.adminloggedin){
    console.log(req.session.loggedin);
  next()
  }else{
    res.redirect("/admin/")
  }
  }

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("adminPage/login");
});

router.get("/admin_homepage",verifyadminLogin, (req, res, next)=> {
  res.render("adminPage/admin_dash");
});

router.get("/admin_userlist",verifyadminLogin,(req, res)=> {
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

router.get("/block_user/:id",verifyadminLogin, (req, res) => {
  adminController.blockUser(req.params.id).then((response) => {
    console.log(response.userId);
    console.log(req.params.id);
    res.redirect("/admin/admin_userlist");
  });
});
router.get("/unblock_user/:id",verifyadminLogin, (req, res) => {
  console.log("Unblocked user");
  adminController.unblocUserk(req.params.id).then((response) => {
    res.redirect("/admin/admin_userlist");
  });
});
router.get("/admin_productadd", (req, res)=> {
  adminController.listCategory().then((category) => {
    res.render("adminPage/productAdd", { category });
  });
});

router.get("/addCategory",verifyadminLogin, (req, res) => {
  adminController.listCategory().then((category) => {
    res.render("adminPage/category", { category });
  });
});

router.get("/listproduct",verifyadminLogin, (req, res) => {
  adminController.listProduct().then((products) => {
    console.log(products);
    res.render("adminPage/productList", { products });
  });
});

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
  router.post("/addcategory",verifyadminLogin, categoryimgupload.single("image"), (req, res) => {
    adminController.addCategory(req.body, req.file).then((data) => {
      res.redirect("/admin/addCategory");
    });
  });

router.post(
  "/addProduct",verifyadminLogin,
  categoryimgupload.array("productImage", 4),
  (req, res) => {
    console.log("jiiiiii");
    adminController.addProduct(req.body, req.files).then((data) => {
      console.log(req.body);
      console.log(data);
      res.redirect("/admin/admin_productadd");
    });
  }
);

module.exports = router;
