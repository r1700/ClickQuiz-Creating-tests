// /backend/src/models/Exam.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    type: { type: String, enum: ["mcq", "open"], required: true }, // type of question: multiple choice or open-ended
    text: { type: String, required: true },
    options: [String],           // options for multiple choice questions
    answer: String               // the correct answer
});

const examSchema = new mongoose.Schema({
    title: { type: String, required: true },   // exam title
    subject: String,                            // subject
    topic: String,                              // topic
    level: { type: String, enum: ["easy", "medium", "hard"] }, // difficulty level
    classroom: String,                          // class
    questions: [questionSchema],               // array of questions
    createdAt: { type: Date, default: Date.now },
    questionTypes: { type: [String], default: ["mcq", "open"] },  // mcq = multiple choice, open = שאלת כתיבה

  // added userId field
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
