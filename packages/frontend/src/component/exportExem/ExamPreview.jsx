import React, { forwardRef } from "react";
import { Box, Typography } from "@mui/material";

const ExamPreview = forwardRef(({ exam, view }, ref) => {
  if (!exam) return null;

  return (
    <Box ref={ref} sx={{
      fontFamily: "'Assistant', sans-serif",
      direction: "rtl",
      width: "210mm",
      minHeight: "297mm",
      margin: "0 auto",
      padding: "20mm 15mm",
      backgroundColor: "#fff",
      color: "#000",
      boxSizing: "border-box",
      boxShadow: 3,
    }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>{exam.title}</Typography>
          <Typography variant="subtitle1">{exam.topic}</Typography>
        </Box>
        {view === "student" && (
          <Box sx={{ textAlign: "left" }}>
            <Typography sx={{ mb: 0.5 }}>שם התלמיד: _______________</Typography>
            <Typography sx={{ mb: 0.5 }}>כיתה: {exam.classroom}</Typography>
            <Typography>ציון: _____</Typography>
          </Box>
        )}
      </Box>

      <hr style={{ border: "2px solid #aaa", marginBottom: "15px" }} />

      <Box sx={{ mt: 2, fontSize: "14px", lineHeight: 1.8 }}>
        {exam.questions?.map((q, i) => (
          <Box key={q._id} sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: "bold", mb: 1 }}>{i + 1}. {q.text}</Typography>
            {q.type === "mcq" && q.options ? (
              <ul style={{ listStyleType: "none", paddingRight: 20 }}>
                {q.options.map((opt, idx) => (
                  <li key={idx} style={{ marginBottom: "5px" }}>
                    <span style={{
                      color: view === "teacher" && q.answer === opt ? "green" : "inherit",
                      fontWeight: view === "teacher" && q.answer === opt ? "bold" : "normal"
                    }}>
                      {view === "teacher" && q.answer === opt ? "✓ " : "◻ "} {opt}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              view === "student" ? (
                <Typography>
                  ____________________________________________________<br/>
                  ____________________________________________________
                </Typography>
              ) : (
                <Typography sx={{ color: "green" }}>תשובה: {q.answer || "לא הוזן"}</Typography>
              )
            )}
            <hr style={{ border: "1px dashed #ddd", marginTop: "10px" }} />
          </Box>
        ))}
      </Box>
      <Typography align="center" sx={{ fontSize: "12px", mt: 4 }}>בהצלחה!</Typography>
    </Box>
  );
});

export default ExamPreview;
