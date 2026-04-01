import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";
import { 
  IMAGE_UPLOAD_DIR, 
  CLOUDINARY_CLOUD_NAME, 
  CLOUDINARY_API_KEY, 
  CLOUDINARY_API_SECRET 
} from "../config/env.js";

// Configure Cloudinary only if credentials exist
const isCloudinaryConfigured = CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
}

export async function saveImages(files) {
  if (!files || files.length === 0) return [];

  const uploadPromises = files.map(async (file) => {
    try {
      const ext = file.mimetype === "image/png" ? "png" : "jpg";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      
      // Process image with Sharp in parallel
      const buffer = await sharp(file.buffer)
        .resize({ width: 1280, withoutEnlargement: true })
        .toFormat(ext === "png" ? "png" : "jpeg", { quality: 80 })
        .toBuffer();

      if (isCloudinaryConfigured) {
        // Parallel Cloudinary upload
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "srcs_reports", resource_type: "image" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });

        return {
          filename: uploadResult.public_id,
          url: uploadResult.secure_url
        };
      } else {
        // Fallback to Local Storage
        const filepath = path.join(IMAGE_UPLOAD_DIR, filename);
        await fs.promises.writeFile(filepath, buffer);
        return {
          filename,
          url: `/uploads/${filename}`
        };
      }
    } catch (err) {
      console.error("Error processing/uploading image:", err);
      return null;
    }
  });

  const results = await Promise.all(uploadPromises);
  return results.filter(r => r !== null);
}
