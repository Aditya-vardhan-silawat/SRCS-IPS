import rateLimit from "express-rate-limit";
import crypto from "crypto";

function ipHash(ip) {
  return crypto.createHash("sha256").update(ip || "unknown").digest("hex");
}

export const reportRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => ipHash(req.ip),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many reports. Please wait a few minutes before submitting again."
    });
  }
});
