// src/components/auth/ResetPassword.jsx
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/authService";

// צבעים
const PRIMARY_COLOR = "#002275";
const SECONDARY_COLOR = "#3B6B7F";
const ACCENT_COLOR = "#FFB300";
const LIGHT_BG = "#F6F9FB";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!password || password.length < 6) {
      setError("הסיסמה חייבת לכלול לפחות 6 תווים");
      return;
    }
    if (password !== confirm) {
      setError("הסיסמאות אינן תואמות");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess("הסיסמה אופסה בהצלחה! מועברת לעמוד ההתחברות...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "שגיאה באיפוס הסיסמה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: LIGHT_BG,
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
            איפוס סיסמה
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="סיסמה חדשה"
              type="password"
              fullWidth
              sx={{ mb: 2 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              label="אימות סיסמה"
              type="password"
              fullWidth
              sx={{ mb: 2 }}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ py: 1.2, borderRadius: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "אפס סיסמה"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
