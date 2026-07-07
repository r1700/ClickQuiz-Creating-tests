import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  Alert,
  CircularProgress,
} from "@mui/material";
import QuestionsList from "./QuestionsList";
import {updateExamService, getExamService } from "../../services/Exam.services";
import { useParams } from "react-router-dom";
import LabeledField from "../common/LabeledField";
import { COLORS } from "../../theme/colors";
import { useExamForm } from "../../hooks/useExamForm";

export default function EditExam() {
  const initialForm = {
    title: "",
    subject: "",
    classroom: "",
    level: "קל",
    topic: "",
  };

  const {
    form,
    setForm,
    loading,
    setLoading,
    message,
    setMessage,
    handleChange,
  } = useExamForm(initialForm);
  const [saving, setSaving] = useState(false);
  const [exam, setExam] = useState(null);
  const { examId } = useParams();


  // fetch exam data on mount
  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const res = await getExamService(examId);
        const data = res.data;
        setExam(data);
        setForm({
          title: data.title || "",
          subject: data.subject || "",
          classroom: data.classroom || "",
          level: getLevelHebrow(data.level) || "קל",
          topic: data.topic || "",
        });
      } catch (err) {
        setMessage({
          type: "error",
          text: "❌ שגיאה בטעינת המבחן. אנא נסי שוב מאוחר יותר.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (examId) fetchExam();
  }, [examId]);

  // save changes to exam
  const handleSaveChanges = async () => {
    setMessage(null);
    setSaving(true);
    try {
      const levelEnglish = getLevelEnglish(form.level);
  
      const updated = {
        ...exam,
        ...form,
        level: levelEnglish,
      };

      await updateExamService(examId, updated);
      setMessage({ type: "success", text: "✅ השינויים נשמרו בהצלחה!" });
    } catch (err) {
      const errMsg =
        err?.response?.data?.error ||
        err?.message ||
        "שגיאה בשמירת השינויים.";
      setMessage({ type: "error", text: `❌ ${errMsg}` });
    } finally {
      setSaving(false);
    }
  };
  
    const getLevelColor = () =>
     form.level === "קל" ? COLORS.successGreen : form.level === "בינוני" ? COLORS.warningOrange : COLORS.dangerRed;
   
   const getLevelHebrow = (level) =>
      level === "easy" ? "קל" : level === "medium" ? "בינוני" : "קשה";
 
   const getLevelEnglish = (level) =>
      level === "קל" ? "easy" : level === "בינוני" ? "medium" : "hard";
 

  if (loading)
    return (
      <Box
        sx={{
          py: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );


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
            עריכת מבחן קיים
          </Typography>

          <LabeledField
            label="כותרת המבחן"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />

          <LabeledField
            label="מקצוע"
            value={form.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
          />

          <LabeledField
            label="כיתה"
            value={form.classroom}
            onChange={(e) => handleChange("classroom", e.target.value)}
          />

          <LabeledField
            label="נושא"
            value={form.topic}
            onChange={(e) => handleChange("topic", e.target.value)}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Typography sx={{ mb: 0.5, fontWeight: 400, color: COLORS.textPrimary }}>
              רמת קושי
            </Typography>
            <Select
              value={form.level}
              onChange={(e) => handleChange("level", e.target.value)}
              sx={{
                color: getLevelColor(),
                borderRadius: 2,
                background: COLORS.surfaceSoft,
                fontWeight: 400,
              }}
            >
              <MenuItem value="קל" sx={{ color: COLORS.successGreen, direction: "rtl" }}>קל</MenuItem>
              <MenuItem value="בינוני" sx={{ color: COLORS.warningOrange, direction: "rtl" }}>בינוני</MenuItem>
              <MenuItem value="קשה" sx={{ color: COLORS.dangerRed, direction: "rtl" }}>קשה</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleSaveChanges}
            disabled={saving}
            fullWidth
            sx={{ mb: 2 }}
          >
            {saving ? "שומר שינויים..." : "שמור שינויים"}
          </Button>

          {message && (
            <Alert severity={message.type} sx={{ mt: 1, fontSize: "1.05rem" }}>
              {message.text}
            </Alert>
          )}

          {exam && (
            <Box sx={{ mt: 3 }}>
              <QuestionsList exam={exam} />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
