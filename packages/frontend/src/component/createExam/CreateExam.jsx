import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import CreateExamAI from "./CreateExamAI.jsx";
import CreateExamManual from "./CreateExamManual.jsx";


import { COLORS } from "../../theme/colors";



export default function CreateExamMain() {
    const [mode, setMode] = useState("ai"); // "ai" או "manual"

    return (

        <Box sx={{ display: "flex", justifyContent: "center", background: COLORS.lightBg }}>
            <Box sx={{ maxWidth: 700, width: "100%", p: 3, mt: { xs: 1, md: 5 } }}>
                <Typography variant="h4" align="center" gutterBottom>
                    יצירת מבחן
                </Typography>

                {/* Button group for selecting AI or manual exam creation */}
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

                {/*Displaying a creation component by status  */}
                {mode === "ai" ? <CreateExamAI /> : <CreateExamManual />}
            </Box>

        </Box>

    );

}
