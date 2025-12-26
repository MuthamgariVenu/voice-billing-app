require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./admin.model");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await Admin.deleteMany(); // optional (clean old)
  await Admin.create({
    username: "admin",
    password: hashedPassword,
    role: "admin"
  });

  console.log("✅ Admin seeded");
  process.exit();
});
