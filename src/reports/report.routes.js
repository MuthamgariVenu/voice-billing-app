const express = require("express");
const router = express.Router();

const authMiddleware = require("../auth/auth.middleware");
const {
  getDailyReport
} = require("./report.controller");

router.get("/daily", authMiddleware, getDailyReport);

module.exports = router;
