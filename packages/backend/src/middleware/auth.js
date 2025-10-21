// middleware/auth.js
import jwt from "jsonwebtoken";

export default function(req, res, next) {
  console.log("💛Cookies:", req.cookies); // בדיקה
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    console.log("💚UserId from token:", req.user.id); // כאן רואים מה באמת מגיע
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};