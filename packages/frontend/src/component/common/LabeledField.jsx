import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { COLORS } from "../../theme/colors";

const LabeledField = ({
  label,
  value,
  onChange,
  type = "text",
  errorText,
  InputProps,
  ...props
}) => (
  <Box sx={{ mb: 2 }}>
    <Typography sx={{ mb: 0.5, fontWeight: 400, color: COLORS.primary }}>{label}</Typography>
    <TextField
      type={type}
      value={value}
      onChange={onChange}
      fullWidth
      error={!!errorText}
      helperText={errorText}
      InputProps={InputProps}
      {...props}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          "& fieldset": { borderColor: COLORS.borderLight },
          "&:hover fieldset": { borderColor: COLORS.borderHover },
          "&.Mui-focused fieldset": { borderColor: COLORS.borderFocus },
        },
        ...props.sx,
      }}
      inputProps={{ dir: "rtl", style: { textAlign: "right" }, ...props.inputProps }}
    />
  </Box>
);

export default LabeledField;
