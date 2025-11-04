// routes/auth.js
import express from "express";
import User from "../models/User.js";
import auth from "../middleware/auth.js";
import {
  login,
  logout,
  register,
  forgotPassword,
  resetPassword,
  googleLogin,
} from "../controllers/auth.controller.js";

const router = express.Router();

// register
router.post("/register", register );
// login
router.post("/login",  login );
// logout
router.post("/logout", auth, logout );
// get current user (protected)
// import auth from "../middleware/auth.js";

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-passwordHash");
  res.json(user);
});

// forgot password
router.post("/forgot-password", forgotPassword);

// reset password
router.post("/reset-password/:token", resetPassword);

// google login
router.post("/google-login", googleLogin);

export default router;
