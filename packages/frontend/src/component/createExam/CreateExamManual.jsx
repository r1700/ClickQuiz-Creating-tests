import React, { useState, useContext } from "react";
import {
  Box, Card, CardContent, Typography, Button, Alert, CircularProgress, Stack,
} from "@mui/material";
import QuestionsList from "./QuestionsList";
import { createExamManualService } from "../../services/Exam.services";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LabeledField from "../common/LabeledField";
import { COLORS } from "../../theme/colors";
import { useExamForm } from "../../hooks/useExamForm";
import QuestionTypeSelector from "./QuestionTypeSelector";
import CreatedExamSummary from "./CreatedExamSummary";
import GuestWarningBanner from "./GuestWarningBanner";

export default function CreateExamManual() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const initialForm = {
    title: "",
    subject: "",
    classroom: "",
    topic: "",
  };

  const {
    form,
    loading,
    setLoading,
    message,
    setMessage,
    guestWarning,
    setGuestWarning,
    handleChange,
    resetForm,
  } = useExamForm(initialForm);
  const [examId, setExamId] = useState(null);

  const handleResetForm = () => {
    resetForm(initialForm);
    setExamId(null);
  };
  // create exam
  const handleCreateExam = async () => {
    if (!user) {
      setGuestWarning(true);
      return;
    }
    setGuestWarning(false);
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
      if (res.isError) {
        if (res.status === 500) {
          setMessage({ type: "error", text: `❌ שגיאה בשרת: ${res.message || "נסי שוב מאוחר יותר"}` });
        } else {
          setMessage({ type: "error", text: `❌ ${res.message || "שגיאה לא צפויה ביצירת המבחן"}` });
        }
        return;
      }

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
        background: COLORS.lightBg,
        direction: "rtl",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 540,
          borderRadius: 5,
          p: 3,
          backgroundColor: COLORS.whiteSoft,
          boxShadow: `0 8px 32px ${COLORS.shadowBlue}`,
          border: `1.5px solid ${COLORS.borderSoft}`,
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            align="center"
            sx={{
              mb: 3,
              color: COLORS.textPrimary,
              letterSpacing: 1,
              textShadow: `0 2px 8px ${COLORS.borderSoft}`,
            }}
          >
            יצירת מבחן ידני
          </Typography>

          {/* Form fields */}
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


          {/* buttons */}

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
            <Button variant="text" fullWidth onClick={handleResetForm}>
              איפוס
            </Button>
          </Stack>

          {/* Guest warning */}
          {guestWarning && <GuestWarningBanner onLogin={() => navigate("/login")} />}

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
