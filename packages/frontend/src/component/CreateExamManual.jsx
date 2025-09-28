import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import QuestionsList from "./QuestionsList";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api"; // כתובת השרת

export default function CreateExamManual() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [classroom, setClassroom] = useState("");
  const [level, setLevel] = useState("easy");
  const [examId, setExamId] = useState(null);

  const handleCreateExam = async () => {
    try {
      const payload = { title, subject, classroom, level, questions: [] };
      const res = await axios.post(`${BASE_URL}/exams/create`, payload);
      setExamId(res.data._id);
      alert("מבחן נוצר! עכשיו ניתן להוסיף שאלות ידנית.");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      {/* <TextField
        label="כותרת המבחן"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      /> */}
      <TextField
        label="מקצוע"
        value={subject}
        onChange={(e) => {
          setSubject(e.target.value);
          setTitle(`מבחן ב${e.target.value}`);
        }}
      fullWidth
      sx={{ mb: 2 }}
      />
      <TextField
        label="כיתה"
        value={classroom}
        onChange={(e) => setClassroom(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        onClick={handleCreateExam}
        disabled={ !subject || !classroom}
        fullWidth
        sx={{ mb: 3 }}
      >
        צור מבחן ידני
      </Button>

      {/* אם יש examId, מציגים את QuestionsList להוספה/עריכה של שאלות */}
      {examId && <QuestionsList exam={{ _id: examId, questions: [] }} />}
    </Box>
  );
}
