// packages/backend/src/routes/pdf.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { sendEmail } from "../utils/sendEmail.js";

// תיקון __dirname ל-ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// הגדרת תיקיית שמירה זמנית
const uploadFolder = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });

// הגדרת multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});
const upload = multer({ storage });

router.post("/upload-pdf", upload.single("file"), (req, res) => {
    console.log("🐒🐒🐒🐒🐒🐒");

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    res.json({ id: req.file.filename });
});

router.get("/pdf/:id", (req, res) => {
    const filePath = path.join(uploadFolder, req.params.id);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath); // מציג את הקובץ בדפדפן
        // res.download(filePath);
    } else {
        console.error("File not found");
        res.status(404).send("File not found");
    }
});
router.post("/send-email", async (req, res) => {
    const { to, subject, text, html } = req.body;

    if (!to || !subject || !text || !html) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    await sendEmail({ to, subject, html, text });
   
    res.json({ message: "Email sent successfully" });
});

export default router;
