const admin = require("../model/adminmodel");
const bcrypt = require("bcrypt");
const userlist = require("../model/usermodel");
const categorycollection = require("../model/categorymodel");
const productcollection = require("../model/productmodel");
const ordercollection = require("../model/userproductOrder");
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
    return new Promise(async (reject, resolve) => {
      const orderstatus = data.orderstatus;
      const orderId = data.orderId;
      const order = await ordercollection.findOneAndUpdate(
        { _id: orderId },
        { $set: { status: orderstatus } }
      );
    });
  },
};
