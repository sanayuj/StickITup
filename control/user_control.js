const dbConnect = require("../config/connection");
const userslist = require("../model/usermodel");
const bcrypt = require("bcrypt");
const { response } = require("../app");
module.exports = {
  //user signup section
  doSignup: (userdata) => {
    console.log(userdata, "HIIIIIIII");
    return new Promise(async (resolve, reject) => {
      try {
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
};
