import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  Stack,
  Chip,
} from "@mui/material";
import QuestionsList from "./QuestionsList";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api"; // כתובת השרת
export default function CreateExamMUI() {
  const [title, setTitle] = useState("מבחן");
  const [subject, setSubject] = useState("");
  const [classroom, setClassroom] = useState("");
  const [level, setLevel] = useState("קל");
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [questionTypes, setQuestionTypes] = useState({ mcq: true, open: false });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [createdExam, setCreatedExam] = useState(null);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setQuestionTypes((prev) => ({ ...prev, [name]: checked }));
  };

  const validateForm = () => {
    // if (!title.trim() || !subject.trim() || !classroom.trim() || !topic.trim()) {
    if (!subject.trim() || !classroom.trim() || !topic.trim()) {
      setMessage({ type: "error", text: "אנא מלאי את כל השדות החיוניים." });
      return false;
    }
    if (!questionTypes.mcq && !questionTypes.open) {
      setMessage({ type: "error", text: "בחרי לפחות סוג שאלה אחד." });
      return false;
    }
    if (numQuestions < 1) {
      setMessage({ type: "error", text: "מספר שאלות חייב להיות לפחות 1." });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setCreatedExam(null);
    setTitle(`מבחן ב${subject}`);

    if (!validateForm()) return;

    setLoading(true);
    try {
      const selectedTypes = Object.keys(questionTypes).filter((k) => questionTypes[k]);
      const levelEnglish = level === "קל" ? "easy" : level === "בינוני" ? "medium" : "hard";
      const payload = {
        title,
        subject,
        classroom,
        level: levelEnglish,
        topic,
        numQuestions,
        questionTypes: selectedTypes,
      };
      console.log("Submitting exam creation with payload:", payload);
      
      const res = await axios.post("/exams/create-ai", payload, {
        baseURL: BASE_URL,
        timeout: 120000,
      });

      setCreatedExam(res.data);
      setMessage({ type: "success", text: "✅ המבחן נוצר בהצלחה!" });
    } catch (err) {
      console.error(err);
      const errMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "שגיאה לא צפויה ביצירת המבחן";
      setMessage({ type: "error", text: `❌ ${errMsg}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 6,
        px: 2,
        direction: "rtl",
      }}
    >
      <Card
        elevation={8}
        sx={{
          maxWidth: 500,
          width: "100%",
          p: 3,
          borderRadius: 4,
          background: "linear-gradient(180deg, #fdfdfd, #f1f6ff)",
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ fontWeight: "bold", color: "#1565c0" }}
          >
            יצירת מבחן חדש
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* כותרת */}
            {/* <TextField
              label="כותרת המבחן"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              margin="normal"
            /> */}

            {/* מקצוע */}
            <TextField
              label="מקצוע"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setTitle(`מבחן ב${e.target.value}`);
              }}
              fullWidth
              required
              margin="normal"
            />

            {/* כיתה */}
            <TextField
              label="כיתה"
              value={classroom}
              onChange={(e) => setClassroom(e.target.value)}
              fullWidth
              required
              margin="normal"
            />

            {/* רמת קושי */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="level-label">רמת קושי</InputLabel>
              <Select
                labelId="level-label"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <MenuItem value="קל">קל</MenuItem>
                <MenuItem value="בינוני">בינוני</MenuItem>
                <MenuItem value="קשה">קשה</MenuItem>
              </Select>
            </FormControl>

            {/* נושא */}
            <TextField
              label="נושא"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              fullWidth
              required
              margin="normal"
            />

            {/* מספר שאלות */}
            <TextField
              label="מספר שאלות"
              type="number"
              inputProps={{ min: 1 }}
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              fullWidth
              margin="normal"
            />

            {/* סוגי שאלות */}
            <FormGroup sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={questionTypes.mcq}
                    onChange={handleCheckboxChange}
                    name="mcq"
                  />
                }
                label="שאלות בחירה"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={questionTypes.open}
                    onChange={handleCheckboxChange}
                    name="open"
                  />
                }
                label="שאלות פתוחות"
              />
            </FormGroup>

            {/* כפתורים */}
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} /> : null}
                fullWidth
                sx={{ py: 1.5 }}
              >
                {loading ? "יוצר מבחן..." : "צור מבחן"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                sx={{ py: 1.5 }}
                onClick={() => {
                  setTitle("");
                  setSubject("");
                  setClassroom("");
                  setLevel("קל");
                  setTopic("");
                  setNumQuestions(5);
                  setQuestionTypes({ mcq: true, open: false });
                  setMessage(null);
                  setCreatedExam(null);
                }}
              >
                נקה
              </Button>
            </Box>
          </Box>

          {/* הודעות */}
          {message && (
            <Box sx={{ mt: 2 }}>
              <Alert severity={message.type}>{message.text}</Alert>
            </Box>
          )}

          {/* תצוגת המבחן */}
          {createdExam && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                תצוגת המבחן שנוצר
              </Typography>

              <Card variant="outlined" sx={{ mb: 2, bgcolor: "#fafafa" }}>
                <CardContent>
                  <Stack direction="column" spacing={1}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {createdExam.title}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip label={createdExam.subject} color="primary" />
                      <Chip label={createdExam.classroom} color="secondary" />
                      <Chip label={createdExam.level || level} color="success" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      נוצר בתאריך:{" "}
                      {new Date(createdExam.createdAt).toLocaleString()}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>

              {/* קומפוננטת שאלות */}
              {/* <QuestionsList
                examId={createdExam._id}
                questions={createdExam.questions}
                onUpdate={(updated) => {
                  setCreatedExam((prev) => ({
                    ...prev,
                    questions: updated,
                  }));
                }}
              /> */}
              <QuestionsList exam={createdExam} />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
