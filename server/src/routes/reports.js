import express from "express";
import { Report } from "../models/Report.js";
import { evaluateSeverity } from "../services/severityEngine.js";
import { isAbusiveOrGarbage, findPossibleDuplicate } from "../services/spamGuard.js";
import { saveImages } from "../services/storageService.js";
import { upload } from "../middleware/upload.js";
import { reportRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post(
  "/",
  reportRateLimiter,
  upload.array("images", 3),
  async (req, res, next) => {
    try {
      const { category, description } = req.body;

      if (!category || !description) {
        return res.status(400).json({ error: "Category and description are required" });
      }

      if (isAbusiveOrGarbage(description)) {
        return res.status(400).json({ error: "Description appears invalid or abusive" });
      }

      const duplicate = await findPossibleDuplicate(category, description);
      if (duplicate) {
        return res.status(409).json({
          error: "A very similar report already exists",
          duplicateId: duplicate._id
        });
      }

      const severityResult = evaluateSeverity(category, description);
      const images = await saveImages(req.files);

      const report = await Report.create({
        category,
        description,
        images,
        severity: severityResult.severity,
        severityScore: severityResult.score,
        severityReasons: severityResult.reasons,
        upvotes: 0
      });

      res.status(201).json({
        id: report._id,
        severity: report.severity,
        severityScore: report.severityScore,
        severityReasons: report.severityReasons
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get("/", async (req, res, next) => {
  try {
    const sort = req.query.sort || "date";

    let sortOption;
    if (sort === "severity") sortOption = { severityScore: -1 };
    else if (sort === "upvotes") sortOption = { upvotes: -1 };
    else sortOption = { createdAt: -1 };

    const reports = await Report.find({ isFlaggedSpam: false })
      .sort(sortOption)
      .select("category description images severity severityScore createdAt upvotes");

    res.json(reports);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/upvote", async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    report.upvotes += 1;
    await report.save();

    res.json({ upvotes: report.upvotes });
  } catch (err) {
    next(err);
  }
});

export default router;
