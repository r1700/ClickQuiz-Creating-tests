import React from "react";
import { Button, Card, Grid, MenuItem, TextField } from "@mui/material";
import { COLORS } from "../../theme/colors";

export default function ExamFiltersCard({
  search,
  subject,
  classroom,
  onSearchChange,
  onSubjectChange,
  onClassroomChange,
  onClearFilters,
  subjects,
  classrooms,
}) {
  return (
    <Card
      variant="outlined"
      sx={{
        mb: 3,
        p: 3,
        bgcolor: COLORS.white,
        borderRadius: "12px",
        boxShadow: `0 6px 18px ${COLORS.shadowCardSoft}`,
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="הקלידי שם מבחן, מקצוע, נושא או כיתה..."
            value={search}
            onChange={onSearchChange}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "12px", height: 52 },
              direction: "rtl",
            }}
          />
        </Grid>

        <Grid item xs={6} sm={3} md={2}>
          <TextField
            select
            value={subject}
            onChange={onSubjectChange}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => (selected ? selected : <span style={{ color: COLORS.textMuted }}>מקצוע</span>),
              MenuProps: { PaperProps: { sx: { direction: "rtl" } } },
            }}
            sx={{ width: "100%", "& .MuiOutlinedInput-root": { borderRadius: "12px", height: 52 }, direction: "rtl" }}
          >
            <MenuItem value="">הכל</MenuItem>
            {subjects.map((sub) => (
              <MenuItem key={sub} value={sub}>{sub}</MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={6} sm={3} md={2}>
          <TextField
            select
            value={classroom}
            onChange={onClassroomChange}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => (selected ? selected : <span style={{ color: COLORS.textMuted }}>כיתה</span>),
              MenuProps: { PaperProps: { sx: { direction: "rtl" } } },
            }}
            sx={{ width: "100%", "& .MuiOutlinedInput-root": { borderRadius: "12px", height: 52 }, direction: "rtl" }}
          >
            <MenuItem value="">הכל</MenuItem>
            {classrooms.map((cr) => (
              <MenuItem key={cr} value={cr}>{cr}</MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} md={2} sx={{ textAlign: "left" }}>
          <Button variant="outlined" onClick={onClearFilters}>
            נקה
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
}
