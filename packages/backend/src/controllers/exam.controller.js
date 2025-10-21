// controllers/exam.controller.js

import Exam from "../models/Exam.js";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

// ✅ יצירת מבחן חדש
export const createExam = async (req, res) => {
    try {
        console.log("Creating exam with data:", req.body);

        const { title, subject, classroom, level, questions } = req.body;
        const exam = new Exam({
            title,
            subject,
            classroom,
            level,
            questions: questions || [], // אם רוצים, אפשר לשלוח שאלות כבר ביצירה
            userId: req.user.id
        });
        const savedExam = await exam.save();
        res.status(201).json(savedExam);
    } catch (err) {
        console.log("Error creating exam:", err);

        res.status(400).json({ error: err.message });
    }
};

// יצירת מבחן חדש עם שאלות שנוצרו על ידי AI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
export const createExamAI = async (req, res) => {
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
        const exam = new Exam({ title, subject, topic, level, classroom, questions, questionTypes, userId: req.user.id });
        const savedExam = await exam.save();

        res.status(201).json(savedExam);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// ✅ שליפת כל המבחנים של משתמש
export const getExamsForUser = async (req, res) => {
    try {
        if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });
        console.log("❤️❤️❤️❤️❤️Fetching exams for user ID:", req.user.id);

        const exams = await Exam.find({ userId: req.user.id }).lean();
        console.log("Fetched exams for user:", exams);
        res.json(exams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// ✅ שליפת מבחן לפי ID
export const getExamById = async (req, res) => {
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
}
// ✅ עדכון מבחן קיים
export const updateExam = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedExam = await Exam.findByIdAndUpdate(id, updateData, {
            new: true, // מחזיר את המסמך המעודכן
            runValidators: true, // שומר על ולידציות
        });

        if (!updatedExam) {
            return res.status(404).json({ error: "המבחן לא נמצא לעדכון." });
        }

        res.status(200).json({
            message: "✅ המבחן עודכן בהצלחה.",
            data: updatedExam,
        });
    } catch (err) {
        console.error("❌ שגיאה בעדכון מבחן:", err);
        res.status(500).json({ error: "שגיאה בשרת בעת עדכון המבחן." });
    }
};

export const deleteExam = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedExam = await Exam.findByIdAndDelete(id);
        if (!deletedExam) {
            return res.status(404).json({ error: "המבחן לא נמצא למחיקה." });
        }

        res.status(200).json({
            message: "✅ המבחן נמחק בהצלחה.",
            data: deletedExam,
        });
    } catch (err) {
        console.error("❌ שגיאה במחיקת מבחן:", err);
        res.status(500).json({ error: "שגיאה בשרת בעת מחיקת המבחן." });
    }
}


