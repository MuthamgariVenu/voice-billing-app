const Shop = require("../shops/shop.model");
const User = require("../users/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ================= SHOP REGISTER =================
exports.registerShop = async (req, res) => {
  try {
    const { shopName, ownerName, mobile, password } = req.body;

    const existingShop = await Shop.findOne({ mobile });
    if (existingShop) {
      return res.status(400).json({ message: "Shop already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const shop = await Shop.create({
      shopName,
      ownerName,
      mobile,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Shop registered successfully",
      shopId: shop._id,
    });
  } catch (err) {
    console.error("🔥 REGISTER ERROR:", err);
    res.status(500).json({
      message: err.message,
      stack: err.stack
    });
  }
};

// ================= SHOP LOGIN =================
exports.loginShop = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const shop = await Shop.findOne({ mobile });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const isMatch = await bcrypt.compare(password, shop.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { shopId: shop._id, role: "shop" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      shopName: shop.shopName,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

// ================= USER LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body; // username = mobile

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        shopId: user.shopId,
        role: "user"
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      shopId: user.shopId,
      username: user.username
    });
  } catch (err) {
    console.error("🔥 USER LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
};
