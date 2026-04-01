import express from "express";
import { Report } from "../models/Report.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.use(verifyAdmin);

router.get("/reports", async (req, res, next) => {
  try {
    const sort = req.query.sort || "severity";

    let sortOption;
    if (sort === "severity") sortOption = { severityScore: -1 };
    else if (sort === "upvotes") sortOption = { upvotes: -1 };
    else sortOption = { createdAt: -1 };

    const reports = await Report.find()
      .sort(sortOption)
      .select(
        "category description images severity severityScore severityReasons upvotes createdAt isFlaggedSpam duplicateOf reportCode parentReportCode status"
      );

    res.json(reports);
  } catch (err) {
    next(err);
  }
});

router.patch("/reports/:id/status", async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["PENDING", "IN_PROGRESS", "RESOLVED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!report) return res.status(404).json({ error: "Report not found" });

    res.json(report);
  } catch (err) {
    next(err);
  }
});

export default router;
