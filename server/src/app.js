import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { CLIENT_ORIGIN, IMAGE_UPLOAD_DIR } from "./config/env.js";
import reportsRouter from "./routes/reports.js";
import adminRouter from "./routes/admin.js";
import authRouter from "./routes/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { ensureUploadDir } from "./middleware/upload.js";

const app = express();

ensureUploadDir();

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(IMAGE_UPLOAD_DIR));

app.use("/api/reports", reportsRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);

app.use(errorHandler);

export default app;
