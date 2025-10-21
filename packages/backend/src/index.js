import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import examRoutes from "./routes/examRoutes.js";
import authRoutes from "./routes/auth.js";
import User from "./models/User.js"; // נתיב למודל שלך

const app = express();
app.use(express.json());
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(cookieParser());




// חיבור ל‑MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch(err => console.error(err));

// שימוש ב‑routes
app.use("/api/exams", examRoutes);
app.use("/api/auth", authRoutes);



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
