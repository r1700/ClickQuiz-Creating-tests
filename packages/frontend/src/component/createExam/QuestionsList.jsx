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

  // the array of questions that can be edited
  const [questions, setQuestions] = useState(exam.questions || []);

  // State to track which question is in edit mode. Key: index, Value: true/false
  const [isEditing, setIsEditing] = useState({});

  // change question text or answer
  const handleChange = (idx, field, value) => {
    const updated = [...questions];
    updated[idx][field] = value;
    setQuestions(updated);
  };

  // change option text for MCQ question
  const handleOptionChange = (qIdx, optIdx, value) => {
    const updated = [...questions];
    updated[qIdx].options[optIdx] = value;
    setQuestions(updated);
  };

  // Toggle edit mode for a question
  const toggleEdit = (idx) => {
    setIsEditing((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Save changes of a question to the server
  const saveQuestion = async (idx) => {
    try {
      const q = questions[idx];
      const examId = exam._id;
      //Calling PUT to the server to save the changes
      await updateQuestionService(examId, q);
      // After saving - exit edit mode
      toggleEdit(idx);
    } catch (err) {
      console.error("Error saving question", err);
    }
  };

  //Add a new question and save it to the server
  //add a new question to the server and update the state
  const addQuestion = async (type) => {
    try {
      const newQuestion = {
        text: type === "mcq" ? "שאלת בחירה חדשה" : "שאלה פתוחה חדשה",
        type: type,
        answer: "",
        options: type === "mcq" ? ["אופציה 1", "אופציה 2"] : [],
      };

      const examId = exam._id;
      const res = await addQuestionService(examId, newQuestion);

      // Update the local state with the new question returned from the server
      setQuestions(prevQuestions => [...prevQuestions, res.data]);
    } catch (err) {
      console.error("Error adding question", err);
    }
  };

  // Delete a question from the array and from the server
  const deleteQuestion = async (idx) => {
    try {
      const q = questions[idx];
      if (q._id) {
        //Calling DELETE to the server to remove the question
        await deleteQuestionService(exam._id, q._id);

      }

      // Remove from local state
      const updated = [...questions];
      updated.splice(idx, 1);
      setQuestions(updated);
    } catch (err) {
      console.error("Error deleting question", err);
    }
  };

  //save of a new answer (local only)
  // const saveAnswer = (idx) => {
  //   setIsEditing((prev) => ({ ...prev, [idx]: false }));
  // };



  return (
    <div>
      {/* General title*/}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        שאלות המבחן
      </Typography>


      {/*map of all the questions  */}
      {questions.map((q, idx) => (
        <Accordion key={q._id || idx} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {/* If in edit mode displays TextField, otherwise Typography */}            {isEditing[idx] ? (
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
            {/* if type is MCQ */}
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
                {/* Correct Answer */}
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
              // type is open question
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

            {/* buttons for each question */}
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
      {/* buttons for adding questions */}
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
          navigate(`/export-exam/${exam._id}`, { state: { exam: exam } });
        }}
      >אישור</Button>

      {/* Component Export exam to PDF */}
      {/* <ExportExam exam={exam} /> */}


    </div>
  );
}
