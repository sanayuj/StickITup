const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "userlist",
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: products,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  totalQty: {
    type: Number,
    default: 0,
  },
});

module.exports = new mongoose.model("cart", cartSchema);
