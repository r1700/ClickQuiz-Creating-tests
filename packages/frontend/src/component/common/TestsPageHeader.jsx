import React from "react";
import { Box, Button, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { COLORS } from "../../theme/colors";

export default function TestsPageHeader({ title, subtitle, onCreateExam, onToggleFilters }) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: `linear-gradient(90deg, ${COLORS.lightBg}, ${COLORS.surfaceSoft})`,
        borderRadius: "12px",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        <Tooltip title="יצירת מבחן חדש">
          <Button
            variant="contained"
            onClick={onCreateExam}
            startIcon={<AddIcon />}
            sx={{ bgcolor: COLORS.accent, minWidth: 0, px: { xs: 1, md: 2 } }}
          >
            <Box sx={{ display: { xs: "none", md: "block" } }}>יצירת מבחן חדש</Box>
          </Button>
        </Tooltip>

        <IconButton
          color="primary"
          onClick={onToggleFilters}
          sx={{
            bgcolor: COLORS.white,
            borderRadius: "10px",
            boxShadow: `0 1px 4px ${COLORS.shadowSoft}`,
          }}
        >
          <SearchIcon />
        </IconButton>
      </Stack>
    </Paper>
  );
}
