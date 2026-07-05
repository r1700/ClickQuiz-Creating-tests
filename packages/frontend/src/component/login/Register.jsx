import React, { useState, useContext } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Link,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { loginWithGoogle, register } from "../../services/authService"; // פונקציה שתיצור בשרת שלך
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

// צבעים
const PRIMARY_COLOR = "#002275";
const SECONDARY_COLOR = "#3B6B7F";
const ACCENT_COLOR = "#FFB300";
const LIGHT_BG = "#F6F9FB";
// --- רכיב עזר לשדה טקסט עם תווית מעל והודעת שגיאה ---
const LabeledField = ({
  label,
  type = "text",
  value,
  onChange,
  errorText,
  InputProps,
}) => (
  <Box sx={{ mb: 1 }}>
    <Typography >{label}</Typography>
    <TextField
      type={type}
      value={value}
      onChange={onChange}
      fullWidth
      error={!!errorText}
      helperText={errorText}
      InputProps={InputProps}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": { borderColor: "#d1d9ff" },
          "&:hover fieldset": { borderColor: "#9fa8da" },
        },
      }}
    />
  </Box>
);

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [globalErr, setGlobalErr] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // אימות טופס
  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "נא להזין שם מלא";
    if (!form.email) errs.email = "נא להזין אימייל";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "אימייל לא תקין";

    if (!form.password) errs.password = "נא להזין סיסמה";
    else if (form.password.length < 6)
      errs.password = "הסיסמה חייבת לכלול לפחות 6 תווים";

    if (!form.confirmPassword) errs.confirmPassword = "נא לאשר סיסמה";
    else if (form.confirmPassword !== form.password)
      errs.confirmPassword = "הסיסמאות אינן תואמות";

    return errs;
  };

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGlobalErr(null);
    setSuccess(null);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const user = await register(form);
      setUser(null);  
      setUser(user);
      setSuccess("נרשמת בהצלחה!");
      setTimeout(() => navigate("/"), 800);
      // setTimeout(() => navigate("/get-my-exams"), 800);
    } catch (e) {
      const msg = e.response?.data?.message || "שגיאה בהרשמה";
      setGlobalErr(msg);
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
            הרשמה
          </Typography>

          {globalErr && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {globalErr}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={submit} noValidate>
            <LabeledField
              label="שם מלא"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              errorText={errors.name}
            />

            <LabeledField
              label="אימייל"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              errorText={errors.email}
            />

            <LabeledField
              label="סיסמה"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              errorText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <LabeledField
              label="אימות סיסמה"
              type={showConfirm ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              errorText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirm(!showConfirm)}
                      edge="end"
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ py: 1.2, borderRadius: 2, mt: 1 }}
            >
              {loading ? <CircularProgress size={24} /> : "הרשמה"}
            </Button>

            <Typography align="center" sx={{ mt: 2 }}>
              כבר יש לך חשבון?{" "}
              <Link
                component="button"
                underline="hover"
                onClick={() => navigate("/login")}
              >
                להתחברות
              </Link>
            </Typography>

            {/* 🔹 Divider “או” */}
            <Divider
              sx={{
                my: 3,
                "&::before, &::after": { borderColor: "#ccc" },
              }}
            >
              <Typography sx={{ color: "#666", fontWeight: 500 }}>או</Typography>
            </Divider>

            {/*  Google Register */}
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  const decoded = jwtDecode(credentialResponse.credential);
                  const idToken = credentialResponse.credential;
                  try {
                    // שלח את ה־idToken לשרת
                    const res = await loginWithGoogle({ idToken });
                    setUser(res.user);
                    // Cookies.set("token", res.user.token, { expires: 7, path: "/" }); // נשמר לשבוע שלם
                    // Cookies.set("userName", res.user.name, { expires: 7, path: "/" });
                    // navigate("/dashboard");
                    navigate("/");
                    // navigate("/get-my-exams");
                  } catch (err) {
                    console.error("Google login error:", err);
                    alert(err.response?.data?.message || "שגיאה בהתחברות עם Google");
                  }

                }}
                onError={() => {
                  alert("שגיאה בהרשמה עם Google");
                }}
                text="signup_with"
                shape="pill"
                width="100%"
              />
            </GoogleOAuthProvider>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
