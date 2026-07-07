import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, ToggleButtonGroup, ToggleButton, Button, IconButton, Menu, MenuItem } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getExamService } from "../../services/Exam.services";
import DownloadMenu from "./DownloadMenu";
import ExamPreview from "./ExamPreview";
import ShareDialog from "./ShareDialog";
import SnackbarMessage from "./SnackbarMessage";
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from "@mui/icons-material/Download";
import { Tooltip } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { useReactToPrint } from "react-to-print";

import { COLORS } from "../../theme/colors";



const ExportExam = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // ref to the main preview component (just for display)
  const previewRef = useRef();

  // two hidden refs - always contain the exam / answers regardless of what is displayed on the screen
  const studentRef = useRef();
  const teacherRef = useRef();

  const [exam, setExam] = useState(null);
  const [view, setView] = useState("student");
  const [shareOpen, setShareOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [printAnchorEl, setPrintAnchorEl] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await getExamService(id);
        if (!res.isError) {
          setExam(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchExam();
  }, [id]);

  const handlePrintStudent = useReactToPrint({
    contentRef: studentRef,
    documentTitle: `${exam?.title || "מבחן"} - שאלון`,
  });

  const handlePrintTeacher = useReactToPrint({
    contentRef: teacherRef,
    documentTitle: `${exam?.title || "מבחן"} - תשובות`,
  });

  const handlePrintOption = (option) => {
    setPrintAnchorEl(null);
    if (option === "student") handlePrintStudent();
    else if (option === "teacher") handlePrintTeacher();
  };

  return (
    <Box sx={{ bgcolor: COLORS.lightBg }}>
      <Box sx={{ maxWidth: "900px", margin: "0 auto", padding: { xs: 1, md: 3 }, direction: "rtl" }}>
        <Button variant="text" onClick={() => navigate(-1)}> → </Button>

        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
          {view === "student" ? "תצוגה מקדימה - שאלון" : "תצוגה מקדימה - תשובות"}
        </Typography>

        <Box sx={{ textAlign: "center", mb: 3 }}>
          <ToggleButtonGroup value={view} exclusive onChange={(e, newView) => newView && setView(newView)}>
            <ToggleButton value="student">שאלון</ToggleButton>
            <ToggleButton value="teacher">תשובות</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* actions: download, share, print */}
        <Box>
          <DownloadMenu studentRef={studentRef} teacherRef={teacherRef} exam={exam} />
          <Tooltip title="שתף">
            <IconButton color="primary" onClick={() => setShareOpen(true)} size="large">
              <ShareIcon />
            </IconButton>
          </Tooltip>

          {/* print */}
          <Tooltip title="הדפס ">
            <IconButton
              color="primary"
              // onClick={() => window.print()}
              onClick={(e) => setPrintAnchorEl(e.currentTarget)}
              size="large"
            >
              <PrintIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Menu anchorEl={printAnchorEl} open={Boolean(printAnchorEl)} onClose={() => setPrintAnchorEl(null)}>
            <MenuItem onClick={() => handlePrintOption("student")}>הדפס שאלון</MenuItem>
            <MenuItem onClick={() => handlePrintOption("teacher")}>הדפס תשובות</MenuItem>
          </Menu>
        </Box>

        {/* main preview component */}
        <ExamPreview ref={previewRef} exam={exam} view={view} />

        {/* hidden previews - always exist in the DOM, off-screen */}
        <Box sx={{ position: "absolute", left: "-9999px", top: 0, width: "900px" }}>
          <ExamPreview ref={studentRef} exam={exam} view="student" />
        </Box>
        <Box sx={{ position: "absolute", left: "-9999px", top: 0, width: "900px" }}>
          <ExamPreview ref={teacherRef} exam={exam} view="teacher" />
        </Box>

        <ShareDialog
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          exam={exam}
          studentRef={studentRef}
          teacherRef={teacherRef}
          setSnackbar={setSnackbar}
        />

        <SnackbarMessage
          open={snackbar.open}
          message={snackbar.message}
          onClose={() => setSnackbar({ open: false, message: "" })}
        />

      </Box>
    </Box>
  );
};

export default ExportExam;
