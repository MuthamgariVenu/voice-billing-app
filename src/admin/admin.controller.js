// ================= ADMIN CONTROLLER =================
// FILE: backend/src/admin/admin.controller.js

const Admin = require("./admin.model");
const User = require("../users/user.model"); // 🔥 EXISTING USER MODEL
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= ADMIN LOGIN =================
// POST /api/admin/login
exports.adminLogin = async (req, res) => {
  try {
    // ---------- INPUT ----------
    const { username, password } = req.body;

    // ---------- VALIDATION ----------
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    // ---------- FIND ADMIN ----------
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({
        message: "Invalid admin credentials"
      });
    }

    // ---------- PASSWORD CHECK ----------
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid admin credentials"
      });
    }

    // ---------- JWT TOKEN ----------
    const token = jwt.sign(
      {
        adminId: admin._id,
        role: "admin"
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ---------- RESPONSE ----------
    res.status(200).json({
      message: "Admin login successful",
      token
    });

  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({
      message: "Server error"
    });
  }
};

// ================= RESET USER PASSWORD =================
// PATCH /api/admin/users/:username/reset-password
exports.resetUserPassword = async (req, res) => {
  try {
    const { username } = req.params;

    // ---------- FIND USER ----------
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // ---------- NEW PASSWORD ----------
    // Rule: last 4 digits of mobile (username)
    const newPassword = username.slice(-4);

    // ---------- HASH PASSWORD ----------
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ---------- UPDATE ----------
    user.password = hashedPassword;
    await user.save();

    // ---------- RESPONSE ----------
    res.status(200).json({
      message: "Password reset successful",
      credentials: {
        username,
        password: newPassword // 🔥 shown only to admin
      }
    });

  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({
      message: "Password reset failed"
    });
  }
};
