import express from "express";
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";
import { JWT_SECRET } from "../config/env.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "24h" });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
