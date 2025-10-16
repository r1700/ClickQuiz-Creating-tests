import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  IconButton,
  Button,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { addQuestionService, deleteQuestionService, updateQuestionService } from "../../services/question.services";


export default function QuestionsList({ exam }) {
  const navigate = useNavigate();

  // מערך השאלות שניתן לעריכה
  const [questions, setQuestions] = useState(exam.questions || []);

  // מצב עריכה לכל שאלה - key: index, value: true/false
  const [isEditing, setIsEditing] = useState({});

  // שינוי טקסט או תשובה של שאלה
  const handleChange = (idx, field, value) => {
    const updated = [...questions];
    updated[idx][field] = value;
    setQuestions(updated);
  };

  // שינוי אופציה של שאלה אמריקאית (MCQ)
  const handleOptionChange = (qIdx, optIdx, value) => {
    const updated = [...questions];
    updated[qIdx].options[optIdx] = value;
    setQuestions(updated);
  };

  // שינוי מצב עריכה של שאלה
  const toggleEdit = (idx) => {
    setIsEditing((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // שמירת שינויים של שאלה בשרת
  const saveQuestion = async (idx) => {
    try {
      const q = questions[idx];
      const examId = exam._id;
      // קריאת PUT לשרת לשמירת השינויים
      await updateQuestionService(examId, q);
      // לאחר שמירה - יוצא ממצב עריכה
      toggleEdit(idx);
    } catch (err) {
      console.error("Error saving question", err);
    }
  };

  // הוספה של שאלה חדשה ושמירה בשרת
  // הוספת שאלה חדשה לשרת ול־state
  const addQuestion = async (type) => {
    try {
      const newQuestion = {
        text: type === "mcq" ? "שאלת בחירה חדשה" : "שאלה פתוחה חדשה",
        type: type,
        answer: "",
        options: type === "mcq" ? ["אופציה 1", "אופציה 2"] : [],
      };

      // קריאה לשרת ליצירת השאלה במסד הנתונים
      const examId = exam._id;
      const res = await addQuestionService(examId, newQuestion);
      console.log(" New question added:", res.data);

      // הוספה של השאלה החדשה ל-state עם הנתונים מהשרת (כולל _id)
      setQuestions(prevQuestions => [...prevQuestions, res.data]);
      console.log("Questions after adding:", questions);
    } catch (err) {
      console.error("Error adding question", err);
    }
  };

  // מחיקת שאלה מהמערך ומהשרת
  const deleteQuestion = async (idx) => {
    try {
      const q = questions[idx];
      if (q._id) {
        // קריאה לשרת למחיקת השאלה
        await deleteQuestionService(exam._id, q._id);
      
      }

      // הסרה מ־state המקומי
      const updated = [...questions];
      updated.splice(idx, 1);
      setQuestions(updated);
    } catch (err) {
      console.error("Error deleting question", err);
    }
  };

  // שמירה של תשובה חדשה (מקומית בלבד)
  // const saveAnswer = (idx) => {
  //   setIsEditing((prev) => ({ ...prev, [idx]: false }));
  // };

  console.log("exam in QuestionsList:", exam);


  return (
    <div>
      {/* כותרת כללית */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        שאלות המבחן
      </Typography>

     
      {/* מעבר על כל השאלות */}
      {questions.map((q, idx) => (
        <Accordion key={q._id || idx} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {/* אם במצב עריכה מציג TextField, אחרת Typography */}
            {isEditing[idx] ? (
              <TextField
                fullWidth
                value={q.text}
                onChange={(e) => handleChange(idx, "text", e.target.value)}
                size="small"
              />
            ) : (
              <Typography sx={{ fontWeight: "bold" }}>
                {idx + 1}. {q.text}
              </Typography>
            )}
          </AccordionSummary>

          <AccordionDetails>
            {/* אם סוג השאלה הוא MCQ */}
            {q.type === "mcq" ? (
              <Box>
                {q.options?.map((opt, i) =>
                  isEditing[idx] ? (
                    <TextField
                      key={i}
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, i, e.target.value)}
                      size="small"
                      label={`אפשרות ${String.fromCharCode(65 + i)}`}
                      sx={{ mb: 1 }}
                      fullWidth
                    />
                  ) : (
                    <Chip
                      key={i}
                      label={`${String.fromCharCode(65 + i)}. ${opt}`}
                      color={q.answer === opt ? "success" : "default"}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  )
                )}
                {/* תשובה נכונה */}
                {isEditing[idx] && (
                  <TextField
                    fullWidth
                    label="תשובה נכונה"
                    value={q.answer}
                    onChange={(e) => handleChange(idx, "answer", e.target.value)}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}
                {!isEditing[idx] && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    תשובה נכונה: <strong>{q.answer}</strong>
                  </Typography>
                )}
              </Box>
            ) : (
              // סוג פתוח
              isEditing[idx] ? (
                <TextField
                  fullWidth
                  label="תשובה לדוגמה"
                  value={q.answer}
                  onChange={(e) => handleChange(idx, "answer", e.target.value)}
                  size="small"
                />
              ) : (
                <Typography>
                  תשובה לדוגמה: <strong>{q.answer || "—"}</strong>
                </Typography>
              )
            )}

            {/* כפתורים לכל שאלה */}
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <IconButton
                onClick={() =>
                  isEditing[idx] ? saveQuestion(idx) : toggleEdit(idx)
                }
                size="small"
              >
                {isEditing[idx] ? <SaveIcon color="success" /> : <EditIcon />}
              </IconButton>
              <IconButton onClick={() => deleteQuestion(idx)} size="small" color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          </AccordionDetails>
        </Accordion>

      ))}
       {/* כפתורים להוספת שאלות */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => addQuestion("open")}
          fullWidth
        >
          הוספת שאלה פתוחה
        </Button>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => addQuestion("mcq")}
          fullWidth
        >
          הוספת שאלה עם אפשרויות בחירה
        </Button>
      </Box>

      <Button
        variant="contained"
        color="primary"
        type="submit"
        fullWidth
        sx={{ py: 1.5 }}
        onClick={() => {
          console.log("Navigating to export exam with id:", exam._id);
          
          navigate(`/export-exam/${exam._id}`, { state: { exam: exam } });
        }}
      >אישור</Button>

      {/* קומפוננטת ייצוא המבחן ל־PDF */}
      {/* <ExportExam exam={exam} /> */}


    </div>
  );
}
