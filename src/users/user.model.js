const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  shopId: mongoose.Schema.Types.ObjectId,
  role: { type: String, default: "user" }
});

module.exports = mongoose.model("User", userSchema);
