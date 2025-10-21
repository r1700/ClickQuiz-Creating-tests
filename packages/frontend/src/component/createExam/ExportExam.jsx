// ExportExam.jsx
import React, { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Menu,
  MenuItem,
} from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { getExamService } from "../../services/Exam.services";

const ExportExam = () => {
  const navigate = useNavigate();
  const ref = useRef();
  const { id } = useParams(); // id של המבחן מה-URL
  console.log(id);
  
  const [exam, setExam] = useState("");
  const [view, setView] = useState("student"); // student | teacher
  const [anchorEl, setAnchorEl] = useState(null); // תפריט

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await getExamService(id);
        setExam(res.data);
      } catch (err) {
        console.error("Error loading exam:", err);
      }
    };

    fetchExam();
  }, [id]);



  // יצירת PDF
  const exportPdf = (mode) => {
    return new Promise((resolve) => {
      setView(mode);
      const mode2 = mode === "student" ? "שאלון" : "תשובות";
      setTimeout(() => {
        html2pdf()
          .set({
            margin: [0, 0, 0, 0],
            filename: `${exam.title || "exam"}_${mode2}.pdf`,
            html2canvas: { scale: 2, logging: false, letterRendering: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          })
          .from(ref.current)
          .save()
          .then(() => resolve());
      }, 300);
    });
  };

  // ייצוא כפול
  const handleExportBoth = async () => {
    await exportPdf("student");
    await exportPdf("teacher");
  };

  // תפריט
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExportOption = async (option) => {
    handleMenuClose();
    if (option === "student") {
      await exportPdf("student");
    } else if (option === "teacher") {
      await exportPdf("teacher");
    } else if (option === "both") {
      await handleExportBoth();
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: 3,
        direction: "rtl"
      }}
    >
      <Button
        variant="text"
        onClick={() => navigate(-1)}
        sx={{ px: 3, py: 1.5, fontSize: "16px"}}
      > → </Button>
            {/* כותרת */}
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 2 }}
      >
        {view === "student" ? "תצוגה מקדימה - שאלון" : "תצוגה מקדימה - תשובות"}
      </Typography>

      {/* בחירת תצוגה */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(e, newView) => newView && setView(newView)}
          aria-label="בחירת תצוגה"
        >
          <ToggleButton value="student">שאלון</ToggleButton>
          <ToggleButton value="teacher">תשובות</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* אזור התצוגה */}
      <Box
        ref={ref}
        sx={{
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
        }}
      >
        {/* ראש העמוד */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
              {exam.title}
            </Typography>
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

        {/* שאלות */}
        <Box sx={{ mt: 2, fontSize: "14px", lineHeight: 1.8 }}>
          {exam.questions?.map((q, i) => (
            <Box key={q._id} sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                {i + 1}. {q.text}
              </Typography>

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
                <>
                  {view === "student" ? (
                    <Typography>
                      ____________________________________________________<br />
                      ____________________________________________________
                    </Typography>
                  ) : (
                    <Typography sx={{ color: "green" }}>
                      תשובה: {q.answer || "לא הוזן"}
                    </Typography>
                  )}
                </>
              )}

              <hr style={{ border: "1px dashed #ddd", marginTop: "10px" }} />
            </Box>
          ))}
        </Box>

        <Typography align="center" sx={{ fontSize: "12px", mt: 4 }}>
          בהצלחה!
        </Typography>
      </Box>

      {/* כפתור תפריט אחד */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleMenuClick}
          endIcon={<ArrowDropDownIcon />}
          sx={{ px: 3, py: 1.5, fontSize: "16px", borderRadius: "12px" }}
        >
          הורד קובץ
        </Button>
        <Menu
          sx={{ mt: 4, textAlign: "center" }}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "top", // הצד של הכפתור אליו "נדבק" התפריט
            horizontal: "left",  // הצד של הכפתור אליו "נדבק" התפריט
          }}
          transformOrigin={{
            vertical: "top", // הצד של התפריט שיוצמד לכפתור
            horizontal: "right",  // הצד של התפריט שיוצמד לכפתור
          }}
        >
          <MenuItem onClick={() => handleExportOption("student")}>
            הורד שאלון
          </MenuItem>
          <MenuItem onClick={() => handleExportOption("teacher")}>
            הורד תשובות
          </MenuItem>
          <MenuItem onClick={() => handleExportOption("both")}>
            הורד שניהם
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default ExportExam;
