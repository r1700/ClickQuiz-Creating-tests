import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, ToggleButtonGroup, ToggleButton, Button, IconButton } from "@mui/material";
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



const ExportExam = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const previewRef = useRef();

  const [exam, setExam] = useState(null);
  const [view, setView] = useState("student");
  const [shareOpen, setShareOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await getExamService(id);
        setExam(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchExam();
  }, [id]);

  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: "מבחן",
    // onAfterPrint: () => alert("ההדפסה הושלמה!"),

  });

  return (
    <Box sx={{ maxWidth: "900px", margin: "0 auto", padding: 3, direction: "rtl" }}>
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

      {/* פעולות : הורדה, שיתוף, הדפסה */}
      <Box>
        <DownloadMenu ref={previewRef} exam={exam} />   
        <Tooltip title="שתף">
          <IconButton color="primary" onClick={() => setShareOpen(true)} size="large">
            <ShareIcon />
          </IconButton>
        </Tooltip>
        {/* הדפסה */}

        <Tooltip title="הדפס ">
          <IconButton
            color="primary"
            // onClick={() => window.print()}
            onClick={handlePrint}
            size="large"
          >
            <PrintIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Box>

      <ExamPreview ref={previewRef} exam={exam} view={view} />

      <ShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        exam={exam}
        previewRef={previewRef}
        setSnackbar={setSnackbar}
      />

      <SnackbarMessage
        open={snackbar.open}
        message={snackbar.message}
        onClose={() => setSnackbar({ open: false, message: "" })}
      />
      
    </Box>
  );
};

export default ExportExam;
