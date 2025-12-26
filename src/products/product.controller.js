const Product = require("./product.model");

// ================= ADD PRODUCT =================
exports.addProduct = async (req, res) => {
  try {
    const { name, price, stock, unit } = req.body;

    if (!name || !price || !stock || !unit) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = new Product({
      name,
      price,
      stock,
      unit,
      shopId: req.user.shopId // ✅ FIXED
    });

    await product.save();

    res.status(201).json(product);

  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET PRODUCTS =================
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      shopId: req.user.shopId // ✅ FIXED
    });

    res.json(products);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// ================= UPDATE PRODUCT =================
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, shopId: req.user.shopId },
      req.body,
      { new: true }
    );

    res.json(product);

  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// ================= DELETE PRODUCT =================
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findOneAndDelete({
      _id: req.params.id,
      shopId: req.user.shopId
    });

    res.json({ message: "Product deleted" });

  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
