const userslist = require("../model/usermodel");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const cart = require("../model/cartmodel");
const wishlist = require("../model/wishlistmodel");
const products = require("../model/productmodel");
const orderSchema = require("../model/userproductOrder");
const { options } = require("../routes/user");
const Razorpay = require("razorpay");
const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("../config/nodemailer");
const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

module.exports = {

  //user signup section

  doSignup: (userdata) => {
    return new Promise(async (resolve, reject) => {
      try {
        const alreadySignup = await userslist.findOne({
          email: userdata.email,
        });
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
            if (user.verified) {
              if (user.blocked) {
                resolve({ blockedUser: true });
              } else {
                if (result) {
                  resolve({ status: true, user });
                } else {
                  resolve({ status: false });
                }
              }
            } else {
              console.log("Not verified !!!!!");
              resolve({ status: false });
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

  verifyOtp: (userOtp, otp) => {
    return new Promise((resolve, reject) => {
      if (userOtp === otp) {
        resolve({ status: true });
      } else {
        resolve({ status: false });
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
            resolve();
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

  // //wishlist

  addtoWishlist: async (userid, productid) => {
    console.log("add to wishlist !!");
    try {
      const productId = mongoose.Types.ObjectId(productid);
      const userwish = await wishlist.findOne({ userId: userid });
      if (userwish) {
        const alreadywishlist = await wishlist.findOneAndUpdate(
          {
            userId: userid,
          },
          { $push: { products: { productId: productid } } }
        );
      } else {
        const newWishlist = new wishlist({
          userId: userid,
          products: [{ productId: productid }],
        });
        await newWishlist.save();
      }
    } catch (error) {
      throw error;
    }
  },

  productExistInWishlist: (productId, userId) => {
    return new Promise(async (resolve, reject) => {
      const userWishlist = await wishlist.findOne({ userId: userId });
      if (userWishlist) {
        const productAlreadyExist = await wishlist.findOne(
          { userId: userId },
          { products: { $elemMatch: { productId: productId } } }
        );
        const productLength = userWishlist.products.length;
        console.log(productLength);
        if (productLength != 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  },

  getwishlistItem: (userId) => {
    return new Promise(async (resolve, reject) => {
      const userid = new mongoose.Types.ObjectId(userId);
      const userWishlist = await wishlist.findOne({ userId: userid });
      if (userWishlist) {
        const productdetails = await wishlist.aggregate([
          { $match: { userId: userid } },
          { $unwind: "$products" },
          {
            $project: {
              productId: "$products.productId",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "wishlistProducts",
            },
          },
          {
            $project: {
              productId: 1,
              wishlistProducts: { $arrayElemAt: ["$wishlistProducts", 0] },
            },
          },
          {
            $project: {
              productId: 1,
              wishlistProducts: 1,
            },
          },
        ]);

        if (productdetails.length != 0) {
          resolve({ productdetails, wishlistExist: true });
        } else {
          resolve({ wishlistExist: false });
        }
      } else {
        resolve({ wishlistExist: false });
      }
    });
  },

  removefromWishlist: (details) => {
    const wishListId = new mongoose.Types.ObjectId(details.wishlistId);
    console.log(wishListId);
    const productId = new mongoose.Types.ObjectId(details.productId);
    console.log(productId);
    return new Promise(async (resolve, reject) => {
      await wishlist.findOneAndUpdate(
        { _id: wishListId, products: { $elemMatch: { productId: productId } } },
        { $pull: { products: { productId: productId } } }
      );
      resolve();
    });
  },

  getcartItem: (userId) => {
    const userid = new mongoose.Types.ObjectId(userId);
    return new Promise(async (resolve, reject) => {
      const usercart = await cart.findOne({ userId: userid });
      if (usercart) {
        const productdetails = await cart.aggregate([
          { $match: { userId: userid } },
          { $unwind: "$products" },
          {
            $project: {
              totalQty: "$totalQty",
              productId: "$products.productId",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "cartProducts",
            },
          },
          {
            $project: {
              totalQty: 1,
              productId: 1,
              quantity: 1,
              cartProducts: { $arrayElemAt: ["$cartProducts", 0] },
            },
          },
          {
            $project: {
              totalQty: 1,
              productId: 1,
              quantity: 1,
              cartProducts: 1,
              totalAmount: {
                $multiply: ["$quantity", "$cartProducts.price1"],
              },
            },
          },
          {
            $project: {
              totalQty: 1,
              productId: 1,
              quantity: 1,
              cartProducts: 1,
              totalAmount: 1,
            },
          },
        ]);
        resolve({ productdetails, cartExist: true });
      } else {
        resolve({ cartExist: false });
      }
    });
  },

  //cart total price

  totalAmount: (userId) => {
    return new Promise(async (resolve, reject) => {
      const userid = new mongoose.Types.ObjectId(userId);
      const usercart = cart.findOne({ userId: userid });
      if (usercart) {
        const totalAmount = await cart.aggregate([
          { $match: { userId: userid } },
          { $unwind: "$products" },
          {
            $project: {
              totalQty: "$totalQty",
              productId: "$products.productId",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "cartProducts",
            },
          },
          {
            $project: {
              totalQty: 1,
              productId: 1,
              quantity: 1,
              cartProducts: { $arrayElemAt: ["$cartProducts", 0] },
            },
          },
          {
            $project: {
              totalQty: 1,
              productId: 1,
              quantity: 1,
              cartProducts: 1,
              totalAmount: {
                $multiply: ["$quantity", "$cartProducts.price1"],
              },
            },
          },
          {
            $project: {
              totalQty: 1,
              productId: 1,
              quantity: 1,
              cartProducts: 1,
              totalAmount: 1,
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$totalAmount" },
            },
          },
          {
            $project: {
              _id: 0,
              total: 1,
            },
          },
        ]);
        let total;
        if (totalAmount.length > 0) {
          total = totalAmount[0].total;
        }
        resolve(total);
      }
    });
  },

  //cart count

  getcartCount: (userId) => {
    return new Promise(async (resolve, reject) => {
      let countValue = 0;
      let cartItems = await cart.findOne({ userId: userId });
      if (cartItems) {
        countValue = cartItems.products.length;
      }
      resolve(countValue);
    });
  },

  removeCartitem: (details) => {
    const cartid = details.cart;
    const productId = details.product;
    return new Promise((resolve, reject) => {
      cart
        .findOneAndUpdate(
          { _id: cartid, products: { $elemMatch: { productId: productId } } },
          {
            $pull: { products: { productId: productId } },
            $inc: { totalQty: -1 },
          }
        )
        .then((data) => {
          resolve({ removeProduct: true });
        });
    });
  },

  changeproductquantity: async (details) => {
    const quantity = details.quantity;
    const cartid = details.cart;
    const productId = details.product;
    const count = parseInt(details.count);
    return new Promise(async (resolve, reject) => {
      if (quantity == 1 && count == -1) {
        await cart
          .findOneAndUpdate(
            { _id: cartid, products: { $elemMatch: { productId: productId } } },
            {
              $pull: { products: { productId: productId } },
              $inc: { totalquantity: count },
            },
            {}
          )
          .then((response) => {
            resolve({ removeProduct: true });
          });
      } else {
        await cart
          .findOneAndUpdate(
            { _id: cartid, products: { $elemMatch: { productId: productId } } },
            { $inc: { "products.$.quantity": count } }
          )
          .then((response) => {
            resolve(response);
          });
      }
    });
  },

  productView: (proId) => {
    return new Promise(async (resolve, reject) => {
      const productdetails = await products.findOne({ _id: proId }).lean();
      resolve(productdetails);
    });
  },

  //address adding

  addAddress: (userId, userdata) => {
    return new Promise(async (resolve, reject) => {
      const updateAddress = {
        name: userdata.name,
        phone: userdata.phone,
        houseaddress: userdata.address,
        state: userdata.state,
        town: userdata.town,
        pin: userdata.pin,
      };

      const userdetails = await userslist.findOne({ _id: userId });
      if ("address" in userdetails) {
        await userslist.findOneAndUpdate(
          { _id: userId },
          { $push: { address: updateAddress } }
        );
      } else {
        await userslist.findOneAndUpdate(
          { _id: userId },
          { $set: { address: updateAddress } }
        );
      }
    });
  },

  showAddress: (userId) => {
    return new Promise(async (resolve, reject) => {
      let userdetails = await userslist.findOne({ _id: userId }).lean();
      const userAddress = userdetails.address;
      resolve(userAddress);
    });
  },

  placeOrder: (userId, order, cartProducts, totalamount) => {
    return new Promise(async (resolve, reject) => {
      const userid = new mongoose.Types.ObjectId(userId);
      const addressid = new mongoose.Types.ObjectId(order.address);
      const addressDetails = await userslist
        .findOne(
          { _id: userid },
          { address: { $elemMatch: { _id: addressid } } }
        )
        .lean();
      const totalAmount = totalamount;
      const products = cartProducts;
      const status =
        order["payment-method"] === "COD" ? "OrderPlaced" : "Pending";

      const newOrder = new orderSchema({
        userid: userId,
        address: addressDetails.address,
        paymentmethod: order["payment-method"],
        orderitem: [],
        totalamount: totalAmount,
        status: status,
      });

      for (let i = 0; i < products.length; i++) {
        orderitem = {
          product: products[i].cartProducts._id,
          quantity: products[i].quantity,
          productprize: products[i].cartProducts.price1,
          totalamount: products[i].totalAmount,
        };

        newOrder.orderitem.push(orderitem);
      }
      await newOrder.save().then((response) => {
        resolve(response._id);
      });
    });
  },

  deleteCart: (userid) => {
    cart
      .findOneAndDelete({ userId: userid })
      .then(() => {})
      .catch((err) => console.log(err));
  },

  //status verified true
  changeverifiedStatus: (orderId) => {
    return new Promise(async (resolve, reject) => {
      await userslist.findOneAndUpdate(
        { _id: orderId },
        { $set: { verified: true } }
      );
      resolve();
    });
  },

  //order product details

  viewOrderDetails: (userid) => {
    return new Promise(async (resolve, reject) => {
      const userId = new mongoose.Types.ObjectId(userid);
      const order = await orderSchema.findOne({ userid: userId });
      if (order) {
        const orderdetails = await orderSchema.aggregate([
          { $match: { userid: userId } },
          { $unwind: "$orderitem" },
          {
            $project: {
              paymentmethod: "$paymentmethod",
              totalamoount: "$totalamount",
              status: "$status",
              productId: "$orderitem.product",
              productquantity: "$orderitem.quantity",
              productprize: "$orderitem.productprize",
              producttotalamount: "$orderitem.totalamount",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "orderProducts",
            },
          },
          {
            $project: {
              paymentmethod: 1,
              totalamoount: 1,
              status: 1,
              productId: 1,
              productquantity: 1,
              productprize: 1,
              producttotalamount: 1,
              orderProducts: {
                $arrayElemAt: ["$orderProducts", 0],
              },
            },
          },
        ]);
        console.log(orderdetails, "Sucess!!!");
        resolve(orderdetails);
      } else {
        resolve();
      }
    });
  },

  viewcurrentOrder: (orderID) => {
    return new Promise(async (resolve, reject) => {
      const orderId = new mongoose.Types.ObjectId(orderID);
      const order = await orderSchema.findOne({ _id: orderId });
      if (order) {
        const orderDetails = await orderSchema.aggregate([
          { $match: { _id: orderId } },
          { $unwind: "$orderitem" },
          {
            $project: {
              paymentmethod: "$paymentmethod",
              totalAmount: "$totalamount",
              productquantity: "$orderitem.quantity",
              productprize: "$orderitem.productprize",
              producttotal: "$orderitem.totalamount",
              status: "$status",
              productId: "$orderitem.product",
              userId: "$userid",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "orderdetails",
            },
          },
          {
            $lookup: {
              from: "userlists",
              localField: "userId",
              foreignField: "_id",
              as: "userdata",
            },
          },
          {
            $project: {
              paymentmethod: 1,
              totalAmount: 1,
              productquantity: 1,
              productprize: 1,
              producttotal: 1,
              status: 1,
              productId: 1,
              orderdetails: {
                $arrayElemAt: ["$orderdetails", 0],
              },
              userdetails: {
                $arrayElemAt: ["$userdata", 0],
              },
            },
          },
          //     {
          // $sort:{}
          //     }
        ]);
        resolve(orderDetails);
      }
    });
  },

  //razorpay

  generateRazorpay: (orderId, total) => {
    return new Promise((resolve, reject) => {
      let options = {
        amount: total * 100,
        currency: "INR",
        receipt: "" + orderId,
      };
      instance.orders.create(options, function (err, order) {
        if (err) {
          console.log(err);
        } else {
          console.log(order);
        }
        resolve(order);
      });
    });
  },

  verifypayment: (details) => {
    return new Promise((resolve, reject) => {
      const crypto = require("crypto");
      const hmac = crypto.createHmac("sha256", "UP1rF0R6YkA2dLbN8LMYGOZS");
      hmac.update(
        details["payment[razorpay_order_id]"] +
          "|" +
          details["payment[razorpay_payment_id]"]
      );
      generated_signature = hmac.digest("hex");

      if (generated_signature == details["payment[razorpay_signature]"]) {
        resolve();
      } else {
        reject();
      }
    });
  },

  //order status

  changeStatus: (orderId) => {
    return new Promise(async (resolve, reject) => {
      await orderSchema.findOneAndUpdate(
        { _id: orderId },
        { $set: { status: "Orderplaced" } }
      );
      resolve();
    });
  },

  //edit profile

  editUserdetails: (userId, userdata) => {
    return new Promise((resolve, reject) => {
      userslist
        .findOneAndUpdate(
          { _id: userId },
          {
            $set: {
              name: userdata.name,
              email: userdata.email,
              phone: userdata.phone,
            },
          }
        )
        .then((data) => {
          resolve(data);
        });
    });
  },

  changepassword: (data, userId) => {
    return new Promise(async (resolve, reject) => {
      const userdata = await userslist.findOne({ _id: userId });
      bcrypt
        .compare(data.currentPassword, userdata.password)
        .then(async (status) => {
          if (status) {
            if (data.newPassword == data.confirmPassword) {
              const salt = await bcrypt.genSalt(10);
              const hashpassword = await bcrypt.hash(data.newPassword, salt);
              data.newPassword = hashpassword;
              const update = await userslist.findOneAndUpdate(
                { _id: userId },
                { $set: { password: data.newPassword } }
              );
              resolve({ status: true });
            } else {
              resolve({ status: false });
            }
          } else {
            resolve({ status: false });
          }
        });
    });
  },

  //cancel order function

  cancelOrder: (orderId) => {
    const orderid = new mongoose.Types.ObjectId(orderId);
    return new Promise(async (resolve, reject) => {
      const order = await orderSchema.findOneAndUpdate(
        { _id: orderid },
        { $set: { status: "Order cancelled" } }
      );
      resolve();
    });
  },
};
