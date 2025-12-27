const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./auth/auth.routes");
const productRoutes = require("./products/product.routes");
const billRoutes = require("./billing/bill.routes");
const reportsRoutes = require("./reports/report.routes");

const app = express();

/* ==================== MIDDLEWARE ==================== */

// ✅ CORS – allow ONLY Vercel frontend
app.use(
  cors({
    origin: "https://voice-billing-app-frontend.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// 🔥 MUST be before routes
app.use(express.json());

/* ==================== HEALTH CHECK ==================== */
app.get("/api", (req, res) => {
  res.json({ status: "Backend running ✅" });
});

/* ==================== DB ==================== */
connectDB();

/* ==================== ROUTES ==================== */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/reports", reportsRoutes);

module.exports = app;
