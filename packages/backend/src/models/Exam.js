// /backend/src/models/Exam.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    type: { type: String, enum: ["mcq", "open"], required: true }, // סוג השאלה: בחירה מרובה או פתוחה
    text: { type: String, required: true },
    options: [String],           // אפשרויות בחירה
    answer: String               // התשובה הנכונה
});

const examSchema = new mongoose.Schema({
    title: { type: String, required: true },   // שם המבחן
    subject: String,                            // מקצוע
    topic: String,                              // נושא
    level: { type: String, enum: ["easy", "medium", "hard"] }, // רמת קושי
    classroom: String,                          // כיתה
    questions: [questionSchema],               // מערך שאלות
    createdAt: { type: Date, default: Date.now },
    questionTypes: { type: [String], default: ["mcq", "open"] },  // mcq = multiple choice, open = שאלת כתיבה

  // הוספת שדה מזהה משתמש
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
