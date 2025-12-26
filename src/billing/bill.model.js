const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Shop"
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },

        name: {
          type: String,
          required: true
        },

        qty: {
          type: Number,
          required: true
        },

        unit: {
          type: String,
          enum: ["kg", "pcs", "ltr"],   // 🔥 IMPORTANT
          default: "pcs"
        },

        price: {
          type: Number,
          required: true
        },

        total: {
          type: Number,
          required: true
        }
      }
    ],

    totalAmount: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", billSchema);
