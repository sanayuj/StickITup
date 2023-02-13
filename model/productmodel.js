const mongoose = require("mongoose");
const { array } = require("../utilities/imgUpload");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  price1: {
    type: Number,
    require: true,
  },
  price2: {
    type: Number,
    require: true,
  },

  product_description: {
    type: String,
    require: true,
  },

  size: {
    type: String,
    require: true,
  },
  imageurl: 
    {
      type:[Object] ,
      require: true,
    },
  stock: {
    type: Number,
    require: true,
  },
  status:{
    type:Boolean,
    require:true
  }
});
module.exports = new mongoose.model("products", productSchema);
