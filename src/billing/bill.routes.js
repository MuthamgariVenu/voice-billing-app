const express = require("express");
const router = express.Router();

const billController = require("./bill.controller");
const authMiddleware = require("../auth/auth.middleware");

// CREATE BILL
router.post("/create", authMiddleware, billController.createBill);

// BILL HISTORY
router.get("/history", authMiddleware, billController.getBillHistory);

// PDF DOWNLOAD
router.get("/:billId/pdf", authMiddleware, billController.generateBillPDF);

module.exports = router;
