import React, { useState, useContext } from "react";
import {
  Box,
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
import { loginWithGoogle, register } from "../../services/authService"; 
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LabeledField from "../common/LabeledField";
import { COLORS } from "../../theme/colors";
import { useAuthForm } from "../../hooks/useAuthForm";
import GoogleAuthButton from "../common/GoogleAuthButton";

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { values, errors, loading, success, globalError, setSuccess, handleChange, submit } = useAuthForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: (form) => {
      const errs = {};
      if (!form.name.trim()) errs.name = "נא להזין שם מלא";
      if (!form.email) errs.email = "נא להזין אימייל";
      else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "אימייל לא תקין";

      if (!form.password) errs.password = "נא להזין סיסמה";
      else if (form.password.length < 6) errs.password = "הסיסמה חייבת לכלול לפחות 6 תווים";

      if (!form.confirmPassword) errs.confirmPassword = "נא לאשר סיסמה";
      else if (form.confirmPassword !== form.password) errs.confirmPassword = "הסיסמאות אינן תואמות";

      return errs;
    },
    onSubmit: async (form) => {
      const res = await register(form);
      if (res.isError) {
        throw new Error(res.message || "שגיאה בהרשמה");
      }

      setUser(res.data);
      setSuccess("נרשמת בהצלחה!");
      setTimeout(() => navigate("/"), 800);
    },
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: COLORS.lightBg,
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

          {globalError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {globalError}
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
              value={values.name}
              onChange={(e) => handleChange("name", e.target.value)}
              errorText={errors.name}
            />

            <LabeledField
              label="אימייל"
              type="email"
              value={values.email}
              onChange={(e) => handleChange("email", e.target.value)}
              errorText={errors.email}
            />

            <LabeledField
              label="סיסמה"
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={(e) => handleChange("password", e.target.value)}
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
              value={values.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
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
                "&::before, &::after": { borderColor: COLORS.dividerGray },
              }}
            >
              <Typography sx={{ color: COLORS.textLight, fontWeight: 500 }}>או</Typography>
            </Divider>

            <GoogleAuthButton
              text="signup_with"
              onSuccess={async (credentialResponse) => {
                const idToken = credentialResponse.credential;
                try {
                  const res = await loginWithGoogle({ idToken });
                  if (res.isError) {
                    throw new Error(res.message || "שגיאה בהתחברות עם Google");
                  }
                  setUser(res.data?.user || res.data);
                  navigate("/");
                } catch (err) {
                  console.error("Google login error:", err);
                  alert(err.message || "שגיאה בהתחברות עם Google");
                }
              }}
              onError={() => {
                alert("שגיאה בהרשמה עם Google");
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
