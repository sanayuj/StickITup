const mongoose = require("mongoose");
const wishlistSchema = new mongoose.Schema({
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
        ref: "products",
      }
    },
  ],
});

module.exports = new mongoose.model("wishlist", wishlistSchema);
