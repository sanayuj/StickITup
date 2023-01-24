const userslist = require("../model/usermodel");
const bcrypt = require("bcrypt");
const { response } = require("../app");
const mongoose = require("mongoose");
const cart = require("../model/cartmodel");
const WishlistModel = require("../model/wishlistmodel");
const nodemailer = require("../config/nodemailer");
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
  getcartItem: (userId) => {
    const userid = new mongoose.Types.ObjectId(userId);
    //console.log(userid,"eeeeeeee");
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
        ]);
        resolve({productdetails,cartExist:true});
        //console.log(productdetails, "joooooiiiiiiipoppoop");
      } else {
        resolve({ cartExist: false });
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

  //add to user wishlist
  //   const addToWish=
  //    async(req,res,next)=>{
  // try{
  // const userId=req.session.user._id;
  // const productId=req.params._id
  // const Wishlist=await WishlistModel.findOne({userId:userId});
  // if(Wishlist){
  //   const isProduct=await WishlistModel.findOne({
  //     $and:[{userId:userId},{
  //       products:{$elemMatch:{productId:productId}}
  //     }]
  //   })
  //   if(isProduct){
  //     res.json({status:false})
  //   }else{
  //     await WishlistModel.updateOne({userId},{
  //       $push:{products:{productId:productId}}
  //     }).then(()=>{res.json({status:true})
  //   }).catch((error)=>{
  //     throw error
  //   })
  //   }
  // }else{
  //   const wishlist=new WishlistModel({
  //     userId,
  //     products:{productId:productId}
  //   })
  //   await wishlist.save().then(()=>{res.json({status:true})
  // }).catch((error)=>{
  //   throw error
  // })
  // }
  // }catch(error){
  //   throw error
  // }

  //   }

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
};
