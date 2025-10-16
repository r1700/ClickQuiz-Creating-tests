import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import {  createExam, createExamAI, getExamById, updateExam, } from "../controllers/exam.controller.js";
import { get } from "mongoose";
import { addQuestion, deleteQuestion, updateQuestion } from "../controllers/question.controller.js";

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
// POST /exams/create - ליצור מבחן חדש
router.post("/create", createExam);

// POST /create-ai - ליצור מבחן עם שאלות מ‑AI לפי כיתה ורמה
router.post("/create-ai", createExamAI);
    

// GET /exams/:id?view=teacher|student
router.get("/get-exams/:id",getExamById );
// עדכון פרטי מבחן (ללא שאלות)
router.put("/update/:id", updateExam);       // ← כאן עדכון

// עדכון שאלה קיימת
router.put("/:examId/questions/:questionId",updateQuestion );

// הוספת שאלה חדשה
router.post("/:examId/questions", addQuestion);

// מחיקת שאלה
router.delete("/:examId/questions/:questionId",deleteQuestion );



export default router;
