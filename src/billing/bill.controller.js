const Bill = require("./bill.model");
const Product = require("../products/product.model");
const PDFDocument = require("pdfkit");

/* =====================================================
   CREATE BILL
===================================================== */
exports.createBill = async (req, res) => {
  try {
    const shopId = req.user.shopId;
    const { items, customerName = "", customerPhone = "" } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No bill items provided" });
    }

    let billItems = [];
    let grandTotal = 0;

    for (const item of items) {
      const product = await Product.findOne({
        _id: item.productId,
        shopId
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < item.qty) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`
        });
      }

      const total = product.price * item.qty;

    billItems.push({
  productId: product._id,
  name: product.name,
  qty: item.qty,
  unit: product.unit,          // 🔥 VERY IMPORTANT
  price: product.price,
  total
});


      grandTotal += total;
    }

    // STOCK UPDATE
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.qty }
      });
    }

    const bill = await Bill.create({
      shopId,
      customerName,
      customerPhone,
      items: billItems,
      totalAmount: grandTotal
    });

    res.status(201).json({
      message: "Bill created successfully",
      bill
    });

  } catch (err) {
    console.error("CREATE BILL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   BILL HISTORY
===================================================== */
exports.getBillHistory = async (req, res) => {
  try {
    const shopId = req.user.shopId;

    const bills = await Bill.find({ shopId })
      .sort({ createdAt: -1 });

    res.status(200).json(bills);
  } catch (err) {
    console.error("BILL HISTORY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   PDF GENERATION (CLEAN & PROFESSIONAL)
===================================================== */
exports.generateBillPDF = async (req, res) => {
  try {
    const shopId = req.user.shopId;
    const { billId } = req.params;

    const bill = await Bill.findOne({ _id: billId, shopId });
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=bill-${bill._id}.pdf`
    );

    doc.pipe(res);

    /* ================= HEADER ================= */
    doc
      .fontSize(18)
      .text("KIRANA STORE", { align: "center", underline: true });

    doc.moveDown(0.8);
    doc.fontSize(11).text(`Bill ID : ${bill._id}`);
    doc.text(`Date    : ${new Date(bill.createdAt).toLocaleString()}`);
    doc.moveDown(1);

    /* ================= TABLE HEADER ================= */
    const startX = 40;
    let y = doc.y;

    doc.fontSize(11).text("Item", startX, y);
    doc.text("Qty", startX + 230, y);
    doc.text("Price", startX + 330, y);

    y += 10;
    doc.moveTo(startX, y).lineTo(550, y).dash(2).stroke();
    y += 8;

    /* ================= ITEMS ================= */
    bill.items.forEach(item => {
      const unit = item.unit || "pcs"; // ✅ NO MORE undefined

      doc.text(item.name, startX, y);
      doc.text(`${item.qty} ${unit}`, startX + 230, y);
      doc.text(`₹ ${item.total}`, startX + 330, y);

      y += 18;
    });

    doc.moveTo(startX, y).lineTo(550, y).dash(2).stroke();

    /* ================= GRAND TOTAL ================= */
    y += 15;
    doc
      .fontSize(13)
      .text(`Grand Total : ₹ ${bill.totalAmount}`, startX + 300, y);

    /* ================= FOOTER ================= */
    doc.moveDown(3);
    doc
      .fontSize(10)
      .text("Thank you for shopping with us", { align: "center" });
    doc.text("Please visit again 🙏", { align: "center" });

    doc.end();

  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
