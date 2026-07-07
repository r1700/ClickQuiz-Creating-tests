import React from "react";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { COLORS } from "../../theme/colors";

const QUESTION_TYPES = [
  { name: "mcq", label: "שאלות בחירה", color: COLORS.linkBlue },
  { name: "open", label: "שאלות פתוחות", color: COLORS.linkBlueDeep },
];

export default function QuestionTypeSelector({ questionTypes, onCheckboxChange }) {
  return (
    <FormGroup sx={{ mb: 2 }}>
      {QUESTION_TYPES.map((type) => (
        <FormControlLabel
          key={type.name}
          control={
            <Checkbox
              checked={questionTypes[type.name]}
              onChange={onCheckboxChange}
              name={type.name}
              icon={<CheckBoxOutlineBlankIcon />}
              checkedIcon={<CheckBoxIcon />}
              sx={{ color: type.color, "&.Mui-checked": { color: type.color } }}
            />
          }
          label={type.label}
        />
      ))}
    </FormGroup>
  );
}
