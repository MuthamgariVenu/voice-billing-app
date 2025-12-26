const express = require("express");
const router = express.Router();

const shopController = require("./shop.controller");
const adminMiddleware = require("../admin/admin.middleware");

router.post("/", adminMiddleware, shopController.createShop);

module.exports = router;
