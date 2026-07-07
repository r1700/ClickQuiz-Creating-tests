
// controllers/auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import { OAuth2Client } from "google-auth-library";
import { log } from "console";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true in prod with HTTPS
    sameSite: process.env.NODE_ENV === "production" ?  "none" : "lax",
    // sameSite: "lax",
    // sameSite: "None" , 
    path: "/",           
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
};

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !password || !name) return res.status(400).json({ message: "Missing fields" });
        const exists = await User.findOne({ email });
        if (exists) return res.status(409).json({ message: "Email already registered" });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = new User({ name, email, passwordHash });
        await user.save();

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, COOKIE_OPTIONS).json({ id: user._id, name: user.name, email: user.email, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Missing fields" });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, COOKIE_OPTIONS).json({ id: user._id, name: user.name, email: user.email, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}
// logout
export const logout = (req, res) => {
    try {
        // מוחקים את כל הקוקיז הרלוונטיים
        const cookiesToClear = ["token", "userName", "g_state"];
        cookiesToClear.forEach(name => {
            res.clearCookie(name, {
                httpOnly: true,          // במיוחד ל-token
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",       
                secure: process.env.NODE_ENV === "production",
                path: "/",               // חשוב למחוק ב-path הנכון
            });
        });

        res.json({ message: "Logged out successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


//  forgotPassword 
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Missing email" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "משתמשת לא נמצאה" });

        //  Create token
        const token = crypto.randomBytes(32).toString("hex");
        user.resetToken = token;
        user.resetTokenExpire = Date.now() + 1000 * 60 * 60; // 1 שעה (לפי רצונך)
        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

        const html = `
      <p>שלום ${user.name || ""},</p>
      <p>קיבלנו בקשה לאיפוס סיסמה. לחצי על הקישור למטה כדי לאפס את הסיסמה (תקף לשעה אחת):</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>אם לא ביקשת זאת — ניתן להתעלם מהמייל.</p>
    `;

        await sendEmail({
            to: user.email,
            subject: "איפוס סיסמה - Teacher Tests",
            html,
            text: `פתח את הקישור כדי לאפס סיסמה: ${resetLink}`,
        });

        res.json({ message: "נשלח מייל לאיפוס סיסמה" });
    } catch (err) {
        console.error("forgotPassword error:", err);
        res.status(500).json({ message: "שגיאה בשליחת מייל" });
    }
};

//  resetPassword 
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        if (!password) return res.status(400).json({ message: "Missing password" });

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpire: { $gt: Date.now() },
        });

        if (!user) return res.status(400).json({ message: "קישור לא תקף או שפג תוקפו" });

        //  update password
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(password, salt);

        user.resetToken = undefined;
        user.resetTokenExpire = undefined;

        await user.save();

        // after reset — create token and send cookie
        const jwtToken = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", jwtToken, COOKIE_OPTIONS).json({ message: "הסיסמה אופסה בהצלחה", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error("resetPassword error:", err);
        res.status(500).json({ message: "שגיאה באיפוס סיסמה" });
    }
};


//  googleLogin 


export const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) return res.status(400).json({ message: "Missing Google idToken" });

        //  create Google client
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        //  verify token
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) return res.status(400).json({ message: "Invalid Google token" });

        const { email, name, sub } = payload;
        if (!email) return res.status(400).json({ message: "Missing email in token" });

        //  check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            //  new user from Google
            user = new User({
                name: name || "משתמש חדש",
                email,
                passwordHash: "",
                googleId: sub,
            });
            await user.save();
        }

        //  create regular JWT for your system
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // send token in cookie and user info in response
        res
            .cookie("token", token, COOKIE_OPTIONS)
            .json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });

    } catch (err) {
        console.error("❌ googleLogin error:", err);
        res.status(500).json({ message: "שגיאה בהתחברות עם Google" });
    }
};
