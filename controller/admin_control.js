const admin = require("../model/adminmodel");
const bcrypt = require("bcrypt");
const userlist = require("../model/usermodel");
const categorycollection=require("../model/categorymodel")
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

  
  addCategory:(categoryDetails,img)=>{
    return new Promise(async(resolve,reject)=>{
      try{
        const newCategory=new categorycollection({
          categoryname:categoryDetails.categoryname,
          imageUrl:img.path
        })
        return await newCategory.save().then((data)=>{resolve(data)}).catch((err)=>{throw err})

      }catch(err){
        throw err
      }
    })
  }
};
