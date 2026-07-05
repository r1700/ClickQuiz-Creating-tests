import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";

const PRIMARY_COLOR = "#002275";
const SECONDARY_COLOR = "#14B0FF";

export default function Footer() {
    return (
        <Box sx={{ mt: 8, background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`, color: "white", py: 5 }}>
            <Container sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body2">© 2025 ClickQuiz - כל הזכויות שמורות</Typography>
                <Box>
                    <Button color="inherit" onClick={() => document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" })}>
                        אודות
                    </Button>
                    <Button color="inherit" onClick={() => window.open("https://mail.google.com/mail/?view=cm&to=your@email.com", "_blank")}>
                        צור קשר
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}