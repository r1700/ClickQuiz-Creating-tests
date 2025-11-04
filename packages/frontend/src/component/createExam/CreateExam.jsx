import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import CreateExamAI from "./CreateExamAI.jsx";
import CreateExamManual from "./CreateExamManual.jsx";


// צבעים
const PRIMARY_COLOR = "#002275";
const SECONDARY_COLOR = "#14B0FF";
const ACCENT_COLOR = "#FFB300";
const LIGHT_BG = "#F6F9FB";

export default function CreateExamMain() {
    const [mode, setMode] = useState("ai"); // "ai" או "manual"

    return (

        <Box sx={{ display: "flex", justifyContent: "center", background: LIGHT_BG }}>
            <Box sx={{ maxWidth: 700, width: "100%", p: 3, mt: 5 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    יצירת מבחן
                </Typography>

                {/* כפתורי בחירה בין AI לידני */}
                <Box sx={{ display: "flex", gap: 2, mb: 3, flexDirection: "row-reverse"}}>
                    <Button
                       
                        variant={mode === "ai" ? "contained" : "outlined"}
                        onClick={() => setMode("ai")}
                        fullWidth
                        sx={{ direction: "rtl"   }}
                    >
                        יצירה באמצעות AI
                    </Button>
                    <Button
                        variant={mode === "manual" ? "contained" : "outlined"}
                        onClick={() => setMode("manual")}
                        fullWidth
                    >
                        יצירה ידנית
                    </Button>
                </Box>

                {/* הצגת קומפוננטת יצירה לפי מצב */}
                {mode === "ai" ? <CreateExamAI /> : <CreateExamManual />}
            </Box>

        </Box>

    );

}
