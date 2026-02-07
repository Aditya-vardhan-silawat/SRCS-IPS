import fs from "fs";
import path from "path";
import sharp from "sharp";
import { IMAGE_UPLOAD_DIR } from "../config/env.js";

export async function saveImages(files) {
  if (!files || files.length === 0) return [];

  const saved = [];

  for (const file of files) {
    const ext = file.mimetype === "image/png" ? "png" : "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filepath = path.join(IMAGE_UPLOAD_DIR, filename);

    await sharp(file.buffer)
      .resize({ width: 1280, withoutEnlargement: true })
      .toFormat(ext === "png" ? "png" : "jpeg", { quality: 80 })
      .toFile(filepath);

    saved.push({
      filename,
      url: `/uploads/${filename}`
    });
  }

  return saved;
}
