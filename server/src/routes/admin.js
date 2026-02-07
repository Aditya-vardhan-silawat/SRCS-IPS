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
        "category description images severity severityScore severityReasons upvotes createdAt isFlaggedSpam duplicateOf"
      );

    res.json(reports);
  } catch (err) {
    next(err);
  }
});

export default router;
