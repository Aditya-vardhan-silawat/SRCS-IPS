import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 4000;
export const MONGO_URI = process.env.MONGO_URI || "mongodb://jamamjj8_db_user:xcUuzfdEycMM92uJ@ac-9pjvvr8-shard-00-00.t4xkhlc.mongodb.net:27017,ac-9pjvvr8-shard-00-01.t4xkhlc.mongodb.net:27017,ac-9pjvvr8-shard-00-02.t4xkhlc.mongodb.net:27017/SRCS?ssl=true&authSource=admin";
export const IMAGE_UPLOAD_DIR = process.env.IMAGE_UPLOAD_DIR || "uploads";
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";
export const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_123";
