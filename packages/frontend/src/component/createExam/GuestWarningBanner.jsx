import React from "react";
import { Box, Button } from "@mui/material";
import { COLORS } from "../../theme/colors";

export default function GuestWarningBanner({ onLogin }) {
  return (
    <Box
      sx={{
        mt: 2,
        p: 1.5,
        bgcolor: COLORS.surfaceOrange,
        borderRadius: 2,
        border: `1px solid ${COLORS.warningBorder}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>עליך להתחבר כדי ליצור מבחן</span>
      <Button size="small" variant="outlined" color="warning" onClick={onLogin}>
        התחברות
      </Button>
    </Box>
  );
}
