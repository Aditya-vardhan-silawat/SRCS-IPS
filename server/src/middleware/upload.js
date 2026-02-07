import multer from "multer";
import fs from "fs";
import path from "path";
import { IMAGE_UPLOAD_DIR } from "../config/env.js";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new Error("Invalid file type"), false);
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024,
    files: 3
  }
});

export function ensureUploadDir() {
  if (!fs.existsSync(IMAGE_UPLOAD_DIR)) {
    fs.mkdirSync(IMAGE_UPLOAD_DIR, { recursive: true });
  }
}
