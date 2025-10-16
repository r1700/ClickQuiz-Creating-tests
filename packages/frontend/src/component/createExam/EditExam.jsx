import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
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

// --- רכיב עזר לשדה טקסט עם תווית ---
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

export default function EditExam() {
  const [form, setForm] = useState({
    title: "",
    subject: "",
    classroom: "",
    level: "קל",
    topic: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [exam, setExam] = useState(null);
  const { examId } = useParams();
  console.log(examId);
  

  // שינוי ערכים
  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  // צבע לפי רמת קושי
  const getLevelColor = () =>
    form.level === "קל"
      ? "#388e3c"
      : form.level === "בינוני"
      ? "#f57c00"
      : "#d32f2f";

  // שליפה ראשונית של מבחן קיים
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
          level:
            data.level === "easy"
              ? "קל"
              : data.level === "medium"
              ? "בינוני"
              : "קשה",
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

  // שמירת שינויים
  const handleSaveChanges = async () => {
    setMessage(null);
    setSaving(true);
    try {
      const levelEnglish =
        form.level === "קל" ? "easy" : form.level === "בינוני" ? "medium" : "hard";

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
            <Typography sx={{ mb: 0.5, fontWeight: 400, color: "#283593" }}>
              רמת קושי
            </Typography>
            <Select
              value={form.level}
              onChange={(e) => handleChange("level", e.target.value)}
              sx={{
                color: getLevelColor(),
                borderRadius: 2,
                background: "#f5f7fa",
                fontWeight: 400,
              }}
            >
              <MenuItem value="קל" sx={{ color: "#388e3c", direction: "rtl" }}>קל</MenuItem>
              <MenuItem value="בינוני" sx={{ color: "#f57c00", direction: "rtl" }}>בינוני</MenuItem>
              <MenuItem value="קשה" sx={{ color: "#d32f2f", direction: "rtl" }}>קשה</MenuItem>
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
