const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

/* ==================== MIDDLEWARE ==================== */
app.use(cors());
app.use(express.json());

/* ==================== ROUTES ==================== */
const adminRoutes = require("./src/admin/admin.routes");
const authRoutes = require("./src/auth/auth.routes");
const productRoutes = require("./src/products/product.routes");
const billRoutes = require("./src/billing/bill.routes.js"); // 🔥 FIXED PATH
const reportRoutes = require("./src/reports/report.routes");



app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/reports", reportRoutes);
/* ==================== DB CONNECT ==================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ Mongo error:", err.message);
    process.exit(1);
  });

/* ==================== SERVER ==================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
