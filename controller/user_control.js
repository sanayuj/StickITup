const dbConnect = require("../config/connection");
const userslist = require("../model/usermodel");
const bcrypt = require("bcrypt");
const { response } = require("../app");
const { default: mongoose } = require("mongoose");
const cart = require("../model/cartmodel");
module.exports = {
  //user signup section
  doSignup: (userdata) => {
    return new Promise(async (resolve, reject) => {
      try {
        let alreadySignup = await userslist.findOne({ email: userdata.email });
        if (alreadySignup) {
          resolve({ exist: true });
        }
        const newUser = userslist({
          name: userdata.name,
          email: userdata.email,
          password: userdata.password,
        });
        return await newUser
          .save()
          .then((data) => {
            resolve({ status: true, data });
          })
          .catch((err) => {
            resolve({ status: false });
          });
      } catch (err) {
        throw err;
      }
    });
  },
  //user loggin section
  doLogin: (userdata) => {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await userslist.findOne({ email: userdata.email });

        if (user) {
          bcrypt.compare(userdata.password, user.password, (err, result) => {
            if (user.blocked) {
              resolve({ blockedUser: true });
            } else {
              if (result) {
                resolve({ status: true, user });
              } else {
                resolve({ status: false });
              }
            }
          });
        } else {
          resolve({ emailidNotExist: true });
        }
      } catch (error) {
        throw error;
      }
    });
  },
  //cart
  addtoCart: (userId, productId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let usercart = await cart.findOne({ userId: userId });

        if (usercart) {
          const alredyincart = await cart.findOne({
            $and: [{ userId }, { products: { $elemMatch: { productId } } }],
          });

          if (alredyincart) {
            await cart.findOneAndUpdate(
              { $and: [{ userId }, { "products.productId": productId }] },
              { $inc: { "products.$.quantity": 1 } }
            );
          } else {
            const newProduct = {
              productId: productId,
              quantity: 1,
            };
            await cart.findOneAndUpdate(
              { userId: userId },
              { $inc: { totalQty: 1 }, $push: { products: newProduct } }
            );
          }
        } else {
          const newcart = new cart({
            userId: userId,
            products: [
              {
                productId: productId,
                quantity: 1,
              },
            ],
            totalQty: 1,
          });
          await newcart
            .save()
            .then((data) => {
              resolve();
            })
            .catch((error) => {
              throw error;
            });
        }
      } catch (error) {
        throw error;
      }
    });
  },
  getcartItem: (userid) => {
    return new Promise(async (resolve, reject) => {
      const usercart = await cart.findOne({ userId: userid });

      if (usercart) {
        const productdetails = await cart
          .findOne({ userId: userid })
          .populate("products.productId")
          .lean();

        resolve(productdetails, { status: true });
      } else {
        resolve({ status: true });
      }
    });
  },
};
