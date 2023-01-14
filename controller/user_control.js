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
  addToCart: (userID, productID) => {
    // const userID = new mongoose.Types.ObjectId(userID);
    // const productID = new mongoose.Types.ObjectId(productID);
    return new Promise(async (resolve, reject) => {
      try {
        const userCart = await cart.findOne({ userId: userID }); //checking user already exists
        if (!userCart) {
          const newCart = new cart({
            userId: userID,
            products: [
              {
                productId: productID,
                quantity: 1,
              },
            ],
            totalQty: 1,
          });
          await newCart.save().then((data) => {
            resolve({ status: true, data });
          });
        } else {
          const productItem = userCart.products;
          //if product is in cart
          const productIndex = productItem.findIndex((item) =>
            item.productId.toString()
          );
          if (productIndex >= 0) {
            //increasing quantity of product
            userCart.products[productIndex].quantity = +quantity;
            await userCart
              .save()
              .then((data) => resolve({ status: true, data }));
          } else {
            const newProduct = {
              productId: productID,
              quantity: 1,
            };
            await cart
              .findOneAndUpdate(
                { userId: userID },
                { $inc: { totalQty: 1 }, $push: { products: newProduct } },
                { new: true }
              )
              .then((data) => {
                resolve({ status: true, data });
              });
          }
        }
      } catch (err) {
        throw err;
      }
    });
  },
};
