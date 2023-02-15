const admin = require("../model/adminmodel");
const bcrypt = require("bcrypt");
const userlist = require("../model/usermodel");
const categorycollection = require("../model/categorymodel");
const productcollection = require("../model/productmodel");
const ordercollection = require("../model/userproductOrder");
const coupons = require("../model/coupon");

//admin loggin section

module.exports = {
  doadminloggin: (admindata) => {
    console.log(admindata);
    console.log(admindata.email);
    return new Promise(async (resolve, reject) => {
      try {
        const adminDetails = await admin.findOne({ email: admindata.email });

        console.log(adminDetails);
        if (adminDetails) {
          bcrypt.compare(
            admindata.password,
            adminDetails.password,
            (err, result) => {
              if (err) throw err;
              if (result) {
                resolve({ status: true, adminDetails });
              } else {
                resolve({ status: false });
              }
            }
          );
        } else {
          resolve({ adminNotExist: true });
        }
      } catch (error) {
        throw error;
      }
    });
  },

  //to get user data

  getuserData: () => {
    return new Promise(async (resolve, reject) => {
      try {
        await userlist
          .find({})
          .lean()
          .then((userdata) => {
            resolve({ status: true, userdata });
            resolve({ status: true });
          })
          .catch((error) => {
            throw error;
          });
      } catch (error) {
        throw error;
      }
    });
  },

  //block user section

  blockUser: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        await userlist
          .updateOne({ _id: userId }, { $set: { blocked: true } })
          .then((userId) => {
            resolve({ status: true, userId });
          })
          .catch((error) => {
            throw error;
          });
      } catch (error) {
        throw error;
      }
    });
  },

  //user unblock section

  unblocUserk: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        await userlist
          .updateOne({ _id: userId }, { $set: { blocked: false } })
          .then((userId) => {
            resolve({ status: true, userId });
          })
          .catch((error) => {
            throw error;
          });
      } catch (error) {
        throw error;
      }
    });
  },

  addCategory: (categoryDetails, img) => {
    return new Promise(async (resolve, reject) => {
      try {
        const newCategory = new categorycollection({
          title: categoryDetails.categoryName,
          image: img.filename,
        });
        return await newCategory
          .save()
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            throw err;
          });
      } catch (err) {
        throw err;
      }
    });
  },

  listCategory: () => {
    return new Promise(async (resolve, reject) => {
      try {
        await categorycollection
          .find({})
          .lean()
          .then((category) => {
            resolve(category);
          })
          .catch((error) => {
            throw error;
          });
      } catch (error) {
        throw error;
      }
    });
  },

  addProduct: async (productDetails, imgFile) => {
    try {
      return await new Promise(async (resolve, reject) => {
        try {
          const newProduct = new productcollection({
            name: productDetails.productName,
            category: productDetails.productCategory,
            price1: productDetails.productmrpPrice,
            price2: productDetails.productsrpPrice,
            product_description: productDetails.productDescription,
            size: productDetails.productSize,
            imageurl: imgFile,
            stock: productDetails.productStock,
          });
          return await newProduct.save().then((data) => {
            resolve(data);
          });
        } catch (error) {
          throw error;
        }
      });
    } catch (error_1) {
      throw error_1;
    }
  },

  listProduct: async () => {
    try {
      return await new Promise(async (resolve, reject) => {
        try {
          await productcollection
            .find({})
            .lean()
            .then((products) => {
              resolve(products);
            });
        } catch (error) {
          throw error;
        }
      });
    } catch (error_1) {
      throw error_1;
    }
  },

  //order list

  listOrder: () => {
    return new Promise(async (resolve, reject) => {
      const order = await ordercollection
        .find()
        .populate("orderitem.product")
        .lean();
      console.log(order);
      resolve(order);
    });
  },

  changeOrderstatus: (data) => {
    return new Promise(async (resolve, reject) => {
      const orderstatus = data.orderstatus;
      const orderId = data.orderId;
      const order = await ordercollection.findOneAndUpdate(
        { _id: orderId },
        { $set: { status: orderstatus } }
      );
    });
  },

  //coupon

  addcoupon: (CouponData) => {
    console.log("add Coupon is working!!!");
    return new Promise(async (resolve, reject) => {
      const newCoupon = new coupons({
        couponCode: CouponData.code,
        expriryDate: CouponData.expirationDate,
        maxDiscount: CouponData.discount,
        minAmount: CouponData.minAmount,
        maxAmount: CouponData.maxDiscount,
      });
      await newCoupon.save();
      resolve();
    });
  },

  listCoupon: () => {
    return new Promise(async (resolve, reject) => {
      const couponDetails = await coupons.find({}).lean();
      resolve(couponDetails);
    });
  },
  deletecategory: (data) => {
    return new Promise(async (resolve, reject) => {
      const categoryId = data;
      console.log(categoryId, "category id is here !!");
      const delect = await categorycollection.deleteOne({ _id: categoryId });
    });
  },

  //category edit

  editcategory: (categoryId) => {
    return new Promise((resolve, reject) => {
      const category = categorycollection.findOne({ _id: categoryId }).lean();
      resolve(category);
    });
  },

  disablePro: async (data) => {
    const productId = data;
    await productcollection.findOneAndUpdate(
      { _id: productId },
      { $set: { status: false } }
    );
  },

  enableProduct: async (data) => {
    const productId = data;
    await productcollection.findOneAndUpdate(
      { _id: productId },
      { $set: { status: true } }
    );
  },

  orderDetailsInMonth: () => {
    return new Promise(async (resolve) => {
      let orders = await ordercollection.aggregate([
        {
          $group: {
            _id: "$monthinNo",
            total: { $sum: "$totalamount" },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);
      let details = [];
      orders.forEach((element) => {
        details.push(element.total);
      });
      resolve({ details });
    });
  },

  updateCategory: (data, file) => {
    return new Promise(async (resolve, reject) => {
      const categoryId = data.categoryId;
      console.log(categoryId, "update category !!!!!");
      if (file) {
        console.log("if");
        await categorycollection.findOneAndUpdate(
          { _id: categoryId },
          {
            $set: {
              title: data.categoryname,
              image: file.filename,
            },
          }
        );
      } else {
        console.log("else");
        await categorycollection.findOneAndUpdate(
          { _id: categoryId },
          {
            $set: {
              title: data.categoryname,
            },
          }
        );
      }
      resolve();
    });
  },

  updateProduct: () => {
    return new Promise(async (resolve, reject) => {
      const productId = req.body.productId;
      const products = await productcollection.findOne({ _id: productId });
      const image = [];
      if (req.files) {
        if (!req.files.image0) {
          image.push(products.imageurl[0]);
        } else {
          image.push(req.files.image0[0]);
        }
        if (!req.files.image1) {
          image.push(products.imageurl[1]);
        } else {
          image.push(req.files.image1[0]);
        }
        if (!req.files.image2) {
          image.push(products.imageurl[2]);
        } else {
          image.push(req.files.image2[0]);
        }
        if (!req.files.image3) {
          image.push(products.imageurl[3]);
        } else {
          image.push(req.files.image3[0]);
        }

        await productcollection.findOneAndUpdate(
          { _id: productId },
          {
            $set: {
              imageurl: image,
            },
          }
        )
      }


      if(req.body.image){

      }else{
        await productcollection.findOneAndUpdate({_id:productId},{$set:{
          name:req.body.productname,
          category:req.body.productcategory,
          price1:req.body.productMRP,
          price2:req.body.productSRP,
          product_description:req.body.productdescription,
        }}).then(()=>{
          res.redirect("/admin/listproduct")
        })
      }
    });
  },
};
