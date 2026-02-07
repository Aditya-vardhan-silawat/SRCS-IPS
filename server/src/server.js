import { PORT } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { Admin } from "./models/Admin.js";
import bcrypt from "bcryptjs";
import app from "./app.js";

async function seedAdmin() {
  const count = await Admin.countDocuments();
  if (count === 0) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);
    await Admin.create({
      username: "admin",
      password: hashedPassword
    });
    console.log("Default admin account created (admin/admin123)");
  }
}

async function start() {
  try {
    await connectDB();
    await seedAdmin();
    app.listen(PORT, () => {
      console.log(`SCRS server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

start();
