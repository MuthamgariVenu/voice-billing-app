const express = require("express");
const router = express.Router();

const auth = require("../auth/auth.middleware");
const controller = require("./product.controller");

// CREATE PRODUCT
router.post("/", auth, controller.addProduct);

// LIST PRODUCTS
router.get("/", auth, controller.getProducts);

// UPDATE PRODUCT
router.put("/:id", auth, controller.updateProduct);

// DELETE PRODUCT
router.delete("/:id", auth, controller.deleteProduct);

module.exports = router;
