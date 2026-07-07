import React, { useState, useContext } from "react";
import {
  Box, Card, CardContent, Typography, Button, FormControl, Select, MenuItem, Alert, Stack, CircularProgress,
} from "@mui/material";
import { createExamAIService } from "../../services/Exam.services";
import QuestionsList from "./QuestionsList";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LabeledField from "../common/LabeledField";
import { COLORS } from "../../theme/colors";
import { useExamForm } from "../../hooks/useExamForm";
import QuestionTypeSelector from "./QuestionTypeSelector";
import CreatedExamSummary from "./CreatedExamSummary";
import GuestWarningBanner from "./GuestWarningBanner";

export default function CreateExamAI() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const initialForm = {
    title: "מבחן",
    subject: "",
    classroom: "",
    level: "קל",
    topic: "",
    numQuestions: 5,
    questionTypes: { mcq: true, open: false },
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
  const [createdExam, setCreatedExam] = useState(null);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const nextQuestionTypes = {
      ...form.questionTypes,
      [name]: checked,
    };
    handleChange("questionTypes", nextQuestionTypes);
  };

  const handleResetForm = () => {
    resetForm(initialForm);
    setCreatedExam(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setGuestWarning(true);
      return;
    }

    setGuestWarning(false);
    setMessage(null);
    setCreatedExam(null);

    if (!form.subject || !form.topic || !form.classroom) {
      setMessage({ type: "error", text: "אנא מלאי את כל השדות החיוניים." });
      return;
    }

    setLoading(true);
    try {
      const selectedTypes = Object.keys(form.questionTypes).filter((k) => form.questionTypes[k]);
      const levelEnglish = GetLevelEnglish(form.level);     

      const payload = {
        ...form,
        level: levelEnglish,
        title: `מבחן ב${form.subject}`,
        questionTypes: selectedTypes,
      };

      const res = await createExamAIService(payload);
      if (res.isError) {
        if (res.status === 429) {
          setMessage({ type: "error", text: "❌ לא ניתן ליצור מבחן כרגע - אין טוקנים זמינים." });
        } else if (res.status === 500) {
          setMessage({ type: "error", text: `❌ שגיאה בשרת: ${res.message || "נסי שוב מאוחר יותר"}` });
        } else {
          setMessage({ type: "error", text: `❌ ${res.message || "שגיאה לא צפויה ביצירת המבחן"}` });
        }
        return;
      }

      setCreatedExam(res.data);
      setMessage({ type: "success", text: "✅ המבחן נוצר בהצלחה!" });
    } catch (err) {
      if (err.response?.status === 429) {
        setMessage({ type: "error", text: "❌ לא ניתן ליצור מבחן כרגע - אין טוקנים זמינים." });
        return;
      }
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

  const getLevelColor = () =>
    form.level === "קל" ? COLORS.successGreen : form.level === "בינוני" ? COLORS.warningOrange : COLORS.dangerRed;
  
  const GetLevelHebrow = (level) =>
     level === "easy" ? "קל" : level === "medium" ? "בינוני" : "קשה";

  const GetLevelEnglish = (level) =>
     level === "קל" ? "easy" : level === "בינוני" ? "medium" : "hard";

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
            sx={{ mb: 3, color: COLORS.primary, letterSpacing: 1, textShadow: `0 2px 8px ${COLORS.borderSoft}` }}
          >
            יצירת מבחן חדש
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <LabeledField
              label="מקצוע"
              value={form.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
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

            <FormControl fullWidth sx={{ mb: 2 }}>
              <Typography sx={{ mb: 0.5, fontWeight: 400, color: COLORS.textPrimary }}>רמת קושי</Typography>
              <Select
                value={form.level}
                onChange={(e) => handleChange("level", e.target.value)}
                sx={{ color: getLevelColor(), borderRadius: 2, background: COLORS.surfaceSoft }}
              >
                <MenuItem value="קל" sx={{ color: COLORS.successGreen, direction: "rtl" }}>קל</MenuItem>
                <MenuItem value="בינוני" sx={{ color: COLORS.warningOrange, direction: "rtl" }}>בינוני</MenuItem>
                <MenuItem value="קשה" sx={{ color: COLORS.dangerRed, direction: "rtl" }}>קשה</MenuItem>
              </Select>
            </FormControl>

            <LabeledField
              label="מספר שאלות"
              type="number"
              value={form.numQuestions}
              onChange={(e) => handleChange("numQuestions", Number(e.target.value))}
            />

            <QuestionTypeSelector questionTypes={form.questionTypes} onCheckboxChange={handleCheckboxChange} />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
              <Button type="submit" variant="contained" disabled={loading || !form.subject || !form.classroom || !form.topic} fullWidth>
                {loading ? <CircularProgress size={20} /> : "יצירת מבחן"}
              </Button>
              <Button variant="text" fullWidth onClick={handleResetForm}>
                איפוס
              </Button>
            </Stack>
          </Box>

          {/* Guest warning */}
          {guestWarning && <GuestWarningBanner onLogin={() => navigate("/login")} />}

          {/* Message */}
          {message && (
            <Alert severity={message.type} sx={{ mt: 2, fontSize: "1.05rem" }}>
              {message.text}
            </Alert>
          )}
        </CardContent>
      </Card>

      {createdExam && (
        <>
          <CreatedExamSummary createdExam={createdExam} getLevelHebrew={GetLevelHebrow} />
          <QuestionsList exam={createdExam} />
        </>
      )}
    </Box>
  );
}