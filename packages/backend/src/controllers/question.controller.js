import Exam from "../models/Exam.js";


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

// update existing question
export const updateQuestion = async (req, res) => {
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
}

//  add new question
export const addQuestion = async (req, res) => {
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
}

//  delete question
export const deleteQuestion =async (req, res) => {
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
}