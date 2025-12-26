const Bill = require("../billing/bill.model");

exports.getDailyReport = async (req, res) => {
  try {
    if (!req.user || !req.user.shopId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const shopId = req.user.shopId;

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const bills = await Bill.find({
      shopId,
      createdAt: { $gte: start, $lte: end }
    });

    const totalBills = bills.length;
    const totalSales = bills.reduce(
      (sum, b) => sum + b.totalAmount,
      0
    );

    res.json({
      date: start.toISOString().split("T")[0],
      totalBills,
      totalSales
    });

  } catch (err) {
    console.error("Report error:", err);
    res.status(500).json({ message: "Report error" });
  }
};
