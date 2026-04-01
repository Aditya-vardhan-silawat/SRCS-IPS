import express from "express";
import { Report } from "../models/Report.js";
import { evaluateSeverity } from "../services/severityEngine.js";
import { isAbusiveOrGarbage, findPossibleDuplicate } from "../services/spamGuard.js";
import { saveImages } from "../services/storageService.js";
import { upload } from "../middleware/upload.js";
import { reportRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

async function generateUniqueReportCode() {
  const digits = 7; // Fixed at 7 digits (range 6-8 as per requirements)
  let code;
  let exists = true;
  
  while (exists) {
    code = Math.floor(Math.random() * (Math.pow(10, digits) - Math.pow(10, digits-1)) + Math.pow(10, digits-1)).toString();
    const existing = await Report.findOne({ reportCode: code });
    if (!existing) exists = false;
  }
  return code;
}

router.post(
  "/",
  reportRateLimiter,
  upload.array("images", 3),
  async (req, res, next) => {
    try {
      const { category, description, parentReportCode } = req.body;

      if (!category || !description) {
        return res.status(400).json({ error: "Category and description are required" });
      }

      if (isAbusiveOrGarbage(description)) {
        return res.status(400).json({ error: "Description appears invalid or abusive" });
      }

      // Validate parentReportCode if provided
      if (parentReportCode) {
        const parentReport = await Report.findOne({ reportCode: parentReportCode });
        if (!parentReport) {
          return res.status(400).json({ error: "The provided parent report code does not exist" });
        }
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
      const reportCode = await generateUniqueReportCode();

      const report = await Report.create({
        category,
        description,
        images,
        severity: severityResult.severity,
        severityScore: severityResult.score,
        severityReasons: severityResult.reasons,
        reportCode,
        parentReportCode: parentReportCode || null,
        upvotes: 0
      });

      res.status(201).json({
        id: report._id,
        reportCode: report.reportCode,
        severity: report.severity,
        severityScore: report.severityScore,
        severityReasons: report.severityReasons
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get("/track/:reportCode", async (req, res, next) => {
  try {
    const { reportCode } = req.params;
    const report = await Report.findOne({ reportCode });
    
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Find all follow-up reports linked to this code
    const followUps = await Report.find({ parentReportCode: reportCode })
      .select("category description severity createdAt status")
      .sort({ createdAt: 1 });

    res.json({
      report: {
        category: report.category,
        description: report.description,
        severity: report.severity,
        status: report.status,
        createdAt: report.createdAt,
        reportCode: report.reportCode
      },
      followUps
    });
  } catch (err) {
    next(err);
  }
});

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
