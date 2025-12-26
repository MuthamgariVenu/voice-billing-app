exports.generateBillPDF = async (req, res) => {
  try {
    const shopId = req.user.shopId;
    const { billId } = req.params;

    const bill = await Bill.findOne({ _id: billId, shopId });
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=bill-${bill._id}.pdf`
    );

    doc.pipe(res);

    /* ===== HEADER ===== */
    doc.font("Courier").fontSize(14).text("KIRANA STORE", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(10);
    doc.text(`Bill ID : ${bill._id}`);
    doc.text(`Date    : ${new Date(bill.createdAt).toLocaleString()}`);
    doc.moveDown();

    /* ===== TABLE HEADER ===== */
    doc.fontSize(11);
    doc.text("Item        Qty        Price");
    doc.text("--------------------------------");

    /* ===== ITEMS ===== */
    bill.items.forEach(item => {
      const name = item.name.padEnd(12, " ");
      const qty  = `${item.qty} ${item.unit}`.padEnd(10, " ");
      const price = `₹${item.total}`;

      doc.text(`${name}${qty}${price}`);
    });

    doc.text("--------------------------------");

    /* ===== GRAND TOTAL ===== */
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Grand Total : ₹${bill.totalAmount}`);

    /* ===== FOOTER ===== */
    doc.moveDown(2);
    doc.fontSize(9);
    doc.text("Thank you for shopping with us", { align: "center" });
    doc.text("Please visit again 🙏", { align: "center" });

    doc.end();

  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
