const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true
    },
    name: String,
    unit: String,
    price: Number,
    stock: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
