import React, { useState } from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import CreateExamAI from "./CreateExamAI";
import CreateExamManual from "./CreateExamManual.jsx";
import ExportExam from "./ExportExam.jsx";

export default function CreateExamMain() {
    const [mode, setMode] = useState("ai"); // "ai" או "manual"

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <Card sx={{ maxWidth: 700, width: "100%", p: 3 }}>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>
                        יצירת מבחן
                    </Typography>

                    {/* כפתורי בחירה בין AI לידני */}
                    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                        <Button
                            variant={mode === "ai" ? "contained" : "outlined"}
                            onClick={() => setMode("ai")}
                            fullWidth
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
                </CardContent>
            </Card>

        </Box>

    );

}
