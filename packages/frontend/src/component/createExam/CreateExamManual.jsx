import React, { useState } from "react";
import {
  Box, Card, CardContent, Typography, TextField, Button, Alert, CircularProgress, Stack,
} from "@mui/material";
import QuestionsList from "./QuestionsList";
import { createExamManualService } from "../../services/Exam.services";

// --- רכיב עזר לשדה טקסט עם תווית מעל ---
const LabeledField = ({ label, value, onChange, type = "text", ...props }) => (
  <Box sx={{ mb: 2 }}>
    <Typography sx={{ mb: 0.5, fontWeight: 400, color: "#283593" }}>{label}</Typography>
    <TextField
      type={type}
      value={value}
      onChange={onChange}
      fullWidth
      {...props}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          "& fieldset": { borderColor: "#d1d9ff" },
          "&:hover fieldset": { borderColor: "#9fa8da" },
          "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
        },
      }}
      inputProps={{ dir: "rtl", style: { textAlign: "right" } }}
    />
  </Box>
);

export default function CreateExamManual() {
  const [form, setForm] = useState({
    title: "",
    subject: "",
    classroom: "",
    topic: "",
  });
  const [examId, setExamId] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // שינוי ערכים
  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  // איפוס טופס
  const resetForm = () => {
    setForm({
      title: "מבחן",
      subject: "",
      classroom: "",
      topic: "",
    });
    setMessage(null);
    setExamId(null);
  };
  // יצירת מבחן
  const handleCreateExam = async () => {
    setMessage(null);
    if (!form.subject || !form.classroom) {
      setMessage({ type: "error", text: "אנא מלאי מקצוע וכיתה לפני יצירה." });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: form.title || `מבחן ב${form.subject}`,
        subject: form.subject,
        classroom: form.classroom,
        topic: form.topic,
        questions: [],
      };

      const res = await createExamManualService(payload);
      setExamId(res.data._id);
      setMessage({ type: "success", text: "✅ מבחן נוצר! עכשיו ניתן להוסיף שאלות ידנית." });
    } catch (err) {
      const errMsg =
        err?.response?.data?.error ||
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
        flexDirection: "column",
        alignItems: "center",
        py: 6,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f0ff 0%, #f9f9ff 100%)",
        direction: "rtl",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 540,
          borderRadius: 5,
          p: 3,
          backgroundColor: "#ffffffcc",
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.12)",
          border: "1.5px solid #e3e8ff",
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            align="center"
            sx={{
              mb: 3,
              color: "#283593",
              letterSpacing: 1,
              textShadow: "0 2px 8px #e3e8ff",
            }}
          >
            יצירת מבחן ידני
          </Typography>

          {/* טופס יצירת מבחן */}
          <LabeledField
            label="מקצוע"
            value={form.subject}
            onChange={(e) => {
              handleChange("subject", e.target.value);
              handleChange("title", `מבחן ב${e.target.value}`);
            }}
          />

          <LabeledField
            label="נושא"
            value={form.topic}
            onChange={(e) => handleChange("topic", e.target.value)}
          />
          
          <LabeledField
            label="כיתה"
            value={form.classroom}
            onChange={(e) => handleChange("classroom", e.target.value)}
          />


          {/* כפתורים */}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
            <Button
              variant="contained"
              onClick={handleCreateExam}
              disabled={loading || !form.subject || !form.classroom}
              fullWidth
              sx={{ mb: 2 }}
            >
              {loading ? <CircularProgress size={20} /> : "צור מבחן ידני"}
            </Button>
            <Button variant="text" fullWidth onClick={resetForm}>
              איפוס
            </Button>
          </Stack>

          {message && (
            <Alert severity={message.type} sx={{ mt: 1, fontSize: "1.05rem" }}>
              {message.text}
            </Alert>
          )}

          {/* הצגת שאלות אם נוצר מבחן */}
          {examId && (
            <Box sx={{ mt: 3 }}>
              <QuestionsList exam={{ _id: examId, questions: [] }} />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
