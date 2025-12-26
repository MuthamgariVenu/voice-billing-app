// 📁 backend/src/shops/shop.controller.js

const Shop = require("./shop.model");
const User = require("../users/user.model");   // 🔥 EXISTING USER MODEL
const bcrypt = require("bcryptjs");

// ================= GET ALL SHOPS =================
const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find().sort({ createdAt: -1 });
    res.json(shops);
  } catch (err) {
    console.error("Get shops error:", err);
    res.status(500).json({ message: "Failed to load shops" });
  }
};

// ================= CREATE SHOP =================
const createShop = async (req, res) => {
  try {
    const { shopName, ownerName, mobile } = req.body;

    // 🔒 Validation
    if (!shopName || !mobile) {
      return res.status(400).json({
        message: "Shop name and mobile are required"
      });
    }

    // ================= CREATE SHOP =================
    const shop = await Shop.create({
      name: shopName,          // REQUIRED BY MODEL
      code: mobile,            // REQUIRED BY MODEL (mobile)
      ownerName,               // optional
      isActive: true,
      createdBy: req.admin.adminId
    });

    // ================= USER AUTO CREATE =================

    // Username = mobile
    const username = mobile;

    // Password = last 4 digits of mobile
    const plainPassword = mobile.slice(-4);

    // Check if user already exists
    let user = await User.findOne({ username });

    if (!user) {
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      user = await User.create({
        username,
        password: hashedPassword,
        role: "user",
        shopId: shop._id
      });
    }

    // ================= RESPONSE =================
    res.status(201).json({
      message: "Shop created successfully",
      shop,
      credentials: {
        username,
        password: plainPassword   // 🔥 SHOW ONLY ONCE (ADMIN)
      }
    });

  } catch (err) {
    console.error("Create shop error:", err);
    res.status(500).json({
      message: "Create failed"
    });
  }
};

module.exports = {
  getAllShops,
  createShop
};
