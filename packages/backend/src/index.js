import express from "express";
import mongoose from "mongoose";
import examRoutes from "./routes/examRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(cors({
    origin: CORS_ORIGIN
}));



// חיבור ל‑MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch(err => console.error(err));

// שימוש ב‑routes
app.use("/api/exams", examRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
