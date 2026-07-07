import React from "react";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { COLORS } from "../../theme/colors";

const ExamInfoBox = ({ label, value, color, bg }) => (
  <Box sx={{ flex: "1 1 45%", p: 1, bgcolor: bg, borderRadius: 2 }}>
    <Typography variant="body2" sx={{ color, fontWeight: 500 }}>
      {label}
    </Typography>
    <Typography variant="body1">{value}</Typography>
  </Box>
);

export default function CreatedExamSummary({ createdExam, getLevelHebrew }) {
  if (!createdExam) return null;

  return (
    <Box sx={{ mt: 4, width: "100%", maxWidth: 540 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ color: COLORS.textPrimary, textShadow: `0 2px 8px ${COLORS.borderSoft}`, mb: 2 }}
      >
        תצוגת המבחן שנוצר
      </Typography>

      <Card
        variant="outlined"
        sx={{
          bgcolor: COLORS.surfaceVerySoft,
          mb: 3,
          borderRadius: 3,
          border: `2px solid ${COLORS.cardBorderBlue}`,
          boxShadow: `0 2px 12px ${COLORS.borderSoft}`,
        }}
      >
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6" sx={{ color: COLORS.textSecondary }}>
              {createdExam.title}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 1 }}>
              <ExamInfoBox label="מקצוע" value={createdExam.subject} color={COLORS.primary} bg={COLORS.surfaceBlue} />
              <ExamInfoBox label="כיתה" value={createdExam.classroom} color={COLORS.warningOrange} bg={COLORS.surfaceOrange} />
              <ExamInfoBox label="רמת קושי" value={getLevelHebrew(createdExam.level)} color={COLORS.successGreen} bg={COLORS.surfaceGreen} />
              <ExamInfoBox label="מספר שאלות" value={createdExam.questions?.length || 0} color={COLORS.dangerRed} bg={COLORS.surfaceRed} />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
