// controllers/exam.controller.js

import Exam from "../models/Exam.js";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

//  create new exam 
export const createExam = async (req, res) => {
    try {

        const { title, subject, classroom, level, questions, topic } = req.body;
        const exam = new Exam({
            title,
            subject,
            classroom,
            level,
            topic,
            questions: questions || [], // if no questions provided, default to empty array
            userId: req.user.id
        });
        const savedExam = await exam.save();
        res.status(201).json(savedExam);
    } catch (err) {
        console.error("Error creating exam:", err);

        res.status(400).json({ error: err.message });
    }
};

//  create a new AI-generated exam

// ---OPEN_AI
//  const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY
// });

// ---GOOGLE GEMINI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const createExamAI = async (req, res) => {
    try {

        const { title, subject, topic, classroom, level, numQuestions, questionTypes } = req.body;

        // prompt to AI using the provided parameters: subject, classroom, level, topic, numQuestions, questionTypes
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

        //---OPEN_AI
        // const response = await openai.chat.completions.create({
        //     model: "gpt-4o-mini",
        //     messages: [{ role: "user", content: prompt }],
        //     temperature: 0.7
        // });

        // let aiText = response.choices[0].message.content;

        //---  GOOGLE GEMINI
        const result = await model.generateContent(prompt);
        let aiText = result.response.text();
        
        // Remove ```json ... ``` if present
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
            if (err.status === 429)
                
                return res.status(429).json({ error: "Not tokens available." });
            return res.status(500).json({ error: "AI did not return valid JSON." });
        }

        // create the exam and save in the DB
        const exam = new Exam({ title, subject, topic, level, classroom, questions, questionTypes, userId: req.user.id });
        const savedExam = await exam.save();

        res.status(201).json(savedExam);
    } catch (err) {
        console.error("Error creating examAI❌:", err);
        if (err.status === 429) {            
            return res.status(429).json({ error: "Not tokens available." });
        }
        res.status(500).json({ error: err.message });
    }
};

//  get all exams for a user
export const getExamsForUser = async (req, res) => {
    try {
        if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });
        const exams = await Exam.find({ userId: req.user.id }).lean();
        res.json(exams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


//  get exam by ID
export const getExamById = async (req, res) => {
    try {
        // const { view } = req.query; // view : "teacher" or "student"
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
//  update existing exam
export const updateExam = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedExam = await Exam.findByIdAndUpdate(id, updateData, {
            new: true, // return the updated document
            runValidators: true, // run validation checks
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


