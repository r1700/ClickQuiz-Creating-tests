import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import {  createExam, createExamAI, getExamById, getExamsForUser, updateExam,deleteExam } from "../controllers/exam.controller.js";
import { get } from "mongoose";
import { addQuestion, deleteQuestion, updateQuestion } from "../controllers/question.controller.js";
import auth from "../middleware/auth.js";

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
// POST /exams/create - to create a new exam
router.post("/create", auth, createExam);

// POST /create-ai - to create a new AI-generated exam
router.post("/create-ai", auth, createExamAI);

router.get("/get-my-exams", auth, getExamsForUser);

// GET /exams/:id?view=teacher|student
router.get("/get-exams/:id",getExamById );

// update exam details (without questions)
router.put("/update/:id", updateExam);  

// delete exam
router.delete("/delete/:id", deleteExam);      

// update existing question
router.put("/:examId/questions/:questionId",updateQuestion );

// add new question
router.post("/:examId/questions", addQuestion);

// delete question
router.delete("/:examId/questions/:questionId",deleteQuestion );



export default router;
