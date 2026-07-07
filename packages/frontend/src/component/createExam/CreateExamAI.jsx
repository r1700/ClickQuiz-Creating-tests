import React, { useState, useContext } from "react";
import {
  Box, Card, CardContent, Typography, TextField, Button, FormControl, FormGroup, FormControlLabel, Checkbox, Select, MenuItem, Alert, Stack, CircularProgress,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { createExamAIService } from "../../services/Exam.services";
import QuestionsList from "./QuestionsList";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// צבעים
const PRIMARY_COLOR = "#002275";
const SECONDARY_COLOR = "#14B0FF";
const ACCENT_COLOR = "#FFB300";
const LIGHT_BG = "#F6F9FB";

// --- Text field helper with label above---
const LabeledField = ({ label, value, onChange, type = "text", ...props }) => (
  <Box sx={{ mb: 2 }}>
    <Typography sx={{ mb: 0.5, fontWeight: 400, color: PRIMARY_COLOR }}>{label}</Typography>
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

// --- רכיב תיבת מידע במבחן שנוצר ---
//--- Exam info box component for the created exam
const ExamInfoBox = ({ label, value, color, bg }) => (
  <Box sx={{ flex: "1 1 45%", p: 1, bgcolor: bg, borderRadius: 2 }}>
    <Typography variant="body2" sx={{ color, fontWeight: 500 }}>
      {label}
    </Typography>
    <Typography variant="body1">{value}</Typography>
  </Box>
);

export default function CreateExamAI() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "מבחן",
    subject: "",
    classroom: "",
    level: "קל",
    topic: "",
    numQuestions: 5,
    questionTypes: { mcq: true, open: false },
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [guestWarning, setGuestWarning] = useState(false);
  const [createdExam, setCreatedExam] = useState(null);


  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      questionTypes: { ...prev.questionTypes, [name]: checked },
    }));
  };

  const resetForm = () => {
    setForm({
      title: "מבחן",
      subject: "",
      classroom: "",
      level: "קל",
      topic: "",
      numQuestions: 5,
      questionTypes: { mcq: true, open: false },
    });
    setMessage(null);
    setGuestWarning(false);
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
    form.level === "קל" ? "#388e3c" : form.level === "בינוני" ? "#f57c00" : "#d32f2f";
  
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
        background: LIGHT_BG,
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
            sx={{ mb: 3, color: PRIMARY_COLOR, letterSpacing: 1, textShadow: "0 2px 8px #e3e8ff" }}
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
              <Typography sx={{ mb: 0.5, fontWeight: 400, color: "#283593" }}>רמת קושי</Typography>
              <Select
                value={form.level}
                onChange={(e) => handleChange("level", e.target.value)}
                sx={{ color: getLevelColor(), borderRadius: 2, background: "#f5f7fa" }}
              >
                <MenuItem value="קל" sx={{ color: "#388e3c", direction: "rtl" }}>קל</MenuItem>
                <MenuItem value="בינוני" sx={{ color: "#f57c00", direction: "rtl" }}>בינוני</MenuItem>
                <MenuItem value="קשה" sx={{ color: "#d32f2f", direction: "rtl" }}>קשה</MenuItem>
              </Select>
            </FormControl>

            <LabeledField
              label="מספר שאלות"
              type="number"
              value={form.numQuestions}
              onChange={(e) => handleChange("numQuestions", Number(e.target.value))}
            />

            <FormGroup sx={{ mb: 2 }}>
              {[
                { name: "mcq", label: "שאלות בחירה", color: "#1976d2" },
                { name: "open", label: "שאלות פתוחות", color: "#0458acff" },
              ].map((type) => (
                <FormControlLabel
                  key={type.name}
                  control={
                    <Checkbox
                      checked={form.questionTypes[type.name]}
                      onChange={handleCheckboxChange}
                      name={type.name}
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                      sx={{ color: type.color, "&.Mui-checked": { color: type.color } }}
                    />
                  }
                  label={type.label}
                />
              ))}
            </FormGroup>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
              <Button type="submit" variant="contained" disabled={loading || !form.subject || !form.classroom || !form.topic} fullWidth>
                {loading ? <CircularProgress size={20} /> : "יצירת מבחן"}
              </Button>
              <Button variant="text" fullWidth onClick={resetForm}>
                איפוס
              </Button>
            </Stack>
          </Box>

          {/* Guest warning */}
          {guestWarning && (
            <Box sx={{
              mt: 2,
              p: 1.5,
              bgcolor: "#fff3e0",
              borderRadius: 2,
              border: "1px solid #FFB300",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <span>עליך להתחבר כדי ליצור מבחן</span>
              <Button size="small" variant="outlined" color="warning" onClick={() => navigate("/login")}>
                התחברות
              </Button>
            </Box>
          )}

          {/* Message */}
          {message && (
            <Alert severity={message.type} sx={{ mt: 2, fontSize: "1.05rem" }}>
              {message.text}
            </Alert>
          )}
        </CardContent>
      </Card>

      {createdExam && (
        <Box sx={{ mt: 4, width: "100%", maxWidth: 540 }}>
          <Typography variant="h6" gutterBottom sx={{ color: "#283593", textShadow: "0 2px 8px #e3e8ff", mb: 2 }}>
            תצוגת המבחן שנוצר
          </Typography>

          <Card variant="outlined" sx={{ bgcolor: "#f9f9ff", mb: 3, borderRadius: 3, border: "2px solid #90caf9", boxShadow: "0 2px 12px #e3e8ff" }}>
            <CardContent>
              <Stack spacing={1.5}>
                <Typography variant="h6" sx={{ color: "#1a237e" }}>{createdExam.title}</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 1 }}>
                  <ExamInfoBox label="מקצוע" value={createdExam.subject} color="#1565c0" bg="#e3f2fd" />
                  <ExamInfoBox label="כיתה" value={createdExam.classroom} color="#ef6c00" bg="#fff3e0" />
                  <ExamInfoBox label="רמת קושי" value={GetLevelHebrow(createdExam.level)} color="#2e7d32" bg="#e8f5e9" />
                  <ExamInfoBox label="מספר שאלות" value={createdExam.questions.length} color="#9a1b1b" bg="#fbe9e7" />
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <QuestionsList exam={createdExam} />
        </Box>
      )}
    </Box>
  );
}