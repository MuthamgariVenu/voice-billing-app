const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

/* ==================== MIDDLEWARE ==================== */

// ✅ CORS FIX – ONLY ALLOW VERCEL FRONTEND
app.use(
  cors({
    origin: "https://voice-billing-app-frontend.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// Body parser
app.use(express.json());

/* ==================== ROUTES ==================== */
const adminRoutes = require("./src/admin/admin.routes");
const authRoutes = require("./src/auth/auth.routes");
const productRoutes = require("./src/products/product.routes");
const billRoutes = require("./src/billing/bill.routes.js");
const reportRoutes = require("./src/reports/report.routes");

// 🔥 HEALTH CHECK (IMPORTANT FOR RENDER)
app.get("/api", (req, res) => {
  res.json({ status: "Backend is running ✅" });
});

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
  console.log(`🚀 Server running on port ${PORT}`);
});
