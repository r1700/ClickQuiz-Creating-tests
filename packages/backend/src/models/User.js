// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["teacher", "admin"], default: "teacher" },
  googleId: { type: String }, // optional
  resetToken: { type: String }, // token for password reset
  resetTokenExpire: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
