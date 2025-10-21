// src/components/ForgetPassword.jsx
import React, { useState } from "react";
import {
    Box, TextField, Button, Typography, Alert, Card, CardContent, CircularProgress, Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { sendPasswordReset } from "../../services/authService"; // נניח שקיים endpoint כזה

export default function ForgetPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!email) return setError("נא להזין כתובת אימייל");
        setLoading(true);

        try {
            await sendPasswordReset(email);
            setSuccess("נשלח אלייך מייל לאיפוס סיסמה!");
        } catch (e) {
            setError(e.response?.data?.message || "שגיאה בשליחת האימייל");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#f3f4f6",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                direction: "rtl",
            }}
        >
            <Card sx={{ width: 380, p: 2, borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                    <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}
                    >
                        שכחתי סיסמה
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                    <Box component="form" onSubmit={handleSubmit}>
                        <Typography> אימייל</Typography>
                        <TextField
                            // label="אימייל"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{ py: 1.2, borderRadius: 2 }}
                        >
                            {loading ? <CircularProgress size={24} /> : "שלח קישור לאיפוס"}
                        </Button>

                        <Typography align="center" sx={{ mt: 2 }}>
                            <Link
                                component="button"
                                underline="hover"
                                onClick={() => navigate("/login")}
                            >
                                חזרה להתחברות
                            </Link>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
