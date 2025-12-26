// 📁 backend/src/admin/admin.routes.js

const express = require("express");
const router = express.Router();

const adminController = require("./admin.controller");
const verifyAdmin = require("./admin.middleware");

// 🔥 CORRECT RELATIVE PATH
const shopController = require("../shops/shop.controller");

/* ================= ADMIN LOGIN ================= */
router.post("/login", adminController.adminLogin);

/* ================= SHOPS ================= */

// GET all shops
router.get(
  "/shops",
  verifyAdmin,               // MUST be function
  shopController.getAllShops // MUST be function
);

// CREATE shop
router.post(
  "/shops",
  verifyAdmin,
  shopController.createShop
);

/* ================= USER PASSWORD RESET ================= */
// PATCH /api/admin/users/:username/reset-password
router.patch(
  "/users/:username/reset-password",
  verifyAdmin,
  adminController.resetUserPassword
);

module.exports = router;
