const express = require("express");
const router = express.Router();

const {
  registerShop,
  loginShop,
  loginUser
} = require("./auth.controller");

// ================= SHOP AUTH =================
router.post("/register", registerShop);
router.post("/shop-login", loginShop);

// ================= USER AUTH =================
router.post("/login", loginUser); // 🔥 USER LOGIN (used by user side UI)

module.exports = router;
