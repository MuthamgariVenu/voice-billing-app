const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./auth/auth.routes");
const productRoutes = require("./products/product.routes");
const billRoutes = require("./billing/bill.routes");
const reportsRoutes = require("./reports/report.routes");


const app = express();
app.use(cors());
// 🔥 MUST BE FIRST
app.use(express.json());

// DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/reports", reportsRoutes); 

// Health check
app.get("/", (req, res) => {
  res.send("🚀 Backend running");
});

module.exports = app;
