import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 4000;
export const MONGO_URI = process.env.MONGO_URI;
export const IMAGE_UPLOAD_DIR = process.env.IMAGE_UPLOAD_DIR || "uploads";
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";
export const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_123";

// Cloudinary Configuration
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
