import React from "react";
import { Button, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import html2pdf from "html2pdf.js";
import DownloadIcon from "@mui/icons-material/Download";
const DownloadMenu = React.forwardRef(({ exam }, ref) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuClick = (e) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const exportPdf = (mode) => {
        if (!exam) return;
        const modeName = mode === "student" ? "שאלון" : "תשובות";
        html2pdf()
            .set({
                margin: [0, 0, 0, 0],
                filename: `${exam.title}_${modeName}.pdf`,
                html2canvas: { scale: 2 },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            })
            .from(ref.current)
            .save();
    };

    const handleExportOption = (option) => {
        handleMenuClose();
        if (option === "both") { exportPdf("student"); exportPdf("teacher"); }
        else exportPdf(option);
    };

    return (
        <>
            <Tooltip title="הורד קובץ">
                <IconButton
                    color="primary"
                    onClick={handleMenuClick}
                    size="large"              
                >
                    <DownloadIcon fontSize="inherit" />
                </IconButton>
            </Tooltip>
            {/* <Button variant="contained" color="primary" onClick={handleMenuClick} endIcon={<ArrowDropDownIcon />}>
                הורד קובץ
            </Button> */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => handleExportOption("student")}>הורד שאלון</MenuItem>
                <MenuItem onClick={() => handleExportOption("teacher")}>הורד תשובות</MenuItem>
                <MenuItem onClick={() => handleExportOption("both")}>הורד שניהם</MenuItem>
            </Menu>
        </>
    );
});

export default DownloadMenu;
