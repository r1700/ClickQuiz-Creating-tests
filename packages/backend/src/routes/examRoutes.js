import express from "express";
import Exam from "../models/Exam.js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
// POST /exams/create - ליצור מבחן חדש
router.post("/create", async (req, res) => {
    try {
        console.log("Creating exam with data:", req.body);

        const { title, subject, classroom, level, questions } = req.body;
        // const exam = new Exam(req.body);
        const exam = new Exam({
            title,
            subject,
            classroom,
            level,
            questions: questions || [], // אם רוצים, אפשר לשלוח שאלות כבר ביצירה
        });
        const savedExam = await exam.save();
        res.status(201).json(savedExam);
    } catch (err) {
        console.log("Error creating exam:", err);

        res.status(400).json({ error: err.message });
    }
});

// POST /create-ai - ליצור מבחן עם שאלות מ‑AI לפי כיתה ורמה
router.post("/create-ai", async (req, res) => {
    try {
        console.log("Creating examAI with data:", req.body);

        const { title, subject, topic, classroom, level, numQuestions, questionTypes } = req.body;

        // prompt ל‑AI בהתאם לכיתה ורמת קושי
        const prompt = `
Create ${numQuestions} questions for ${subject}.
Classroom: ${classroom}, Level: ${level}.
Focus on the following topic: ${topic}.
Include only these question types: ${questionTypes.join(", ")}.
Return strictly as a JSON array MUST have these fields and only ${numQuestions} questions and must be of level ${level}:
- question type ("mcq" or "open")
- text
- options (array, only for mcq)
- answer
Do NOT include explanations, markdown, or extra text. Return valid JSON only.
`;
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7
        });

        let aiText = response.choices[0].message.content;

        // הסרה של ```json ... ``` אם קיים
        aiText = aiText.replace(/```json|```/g, "").trim();
        let questions = [];

        try {
            questions = JSON.parse(aiText);
            questions = questions.map(q => ({
                type: q.type || (q.options && q.options.length ? "mcq" : "open"),
                text: q.text,
                options: q.options || [],
                answer: q.answer || ""
            }));
        } catch (err) {
            console.error("Failed to parse AI response:", err);
            return res.status(500).json({ error: "AI did not return valid JSON." });
        }

        // יצירת המבחן ושמירה במסד
        const exam = new Exam({ title, subject, topic, level, classroom, questions, questionTypes });
        const savedExam = await exam.save();

        res.status(201).json(savedExam);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// GET /exams/:id?view=teacher|student
router.get("/get-exams/:id", async (req, res) => {
    try {
        // const { view } = req.query; // view יכול להיות "teacher" או "student"
        const exam = await Exam.findById(req.params.id).lean();
        if (!exam) return res.status(404).json({ error: "Exam not found" });

        let resultExam;

        // if (view === "student") {
        //     // הסרת תשובות למבחן תלמיד
        //     resultExam = {
        //         ...exam,
        //         questions: exam.questions.map(q => ({ text: q.text, options: q.options }))
        //     };
        // } else {
            // גרסת מורה (כולל תשובות)
            resultExam = exam;
        // }

        res.json(resultExam);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
// עדכון שאלה קיימת
router.put("/:examId/questions/:questionId", async (req, res) => {
    try {
        const { examId, questionId } = req.params;
        const { text, type, options, answer } = req.body;

        const exam = await Exam.findById(examId);
        if (!exam) return res.status(404).json({ error: "המבחן לא נמצא" });

        const question = exam.questions.id(questionId);
        if (!question) return res.status(404).json({ error: "השאלה לא נמצאה" });

        question.text = text ?? question.text;
        question.type = type ?? question.type;
        question.options = options ?? question.options;
        question.answer = answer ?? question.answer;

        await exam.save();
        res.json(question);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// הוספת שאלה חדשה
router.post("/:examId/questions", async (req, res) => {
    try {
        const { examId } = req.params;
        const { text, type, options, answer } = req.body;

        const exam = await Exam.findById(examId);
        if (!exam) return res.status(404).json({ error: "המבחן לא נמצא" });

        const newQuestion = { text, type, options, answer };
        exam.questions.push(newQuestion);
        await exam.save();

        res.status(201).json(exam.questions[exam.questions.length - 1]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// מחיקת שאלה
router.delete("/:examId/questions/:questionId", async (req, res) => {
    try {
        const { examId, questionId } = req.params;

        const exam = await Exam.findById(examId);
        if (!exam) return res.status(404).json({ error: "המבחן לא נמצא" });

        const question = exam.questions.id(questionId);
        if (!question) return res.status(404).json({ error: "השאלה לא נמצאה" });

        question.deleteOne();
        await exam.save();

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



export default router;
