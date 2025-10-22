import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Box, Button, InputAdornment, Typography, Divider } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EmailIcon from "@mui/icons-material/Email";
import { QRCodeCanvas } from "qrcode.react";
import html2pdf from "html2pdf.js";
import { uploadPdf } from "../../services/pdf.services";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const ShareDialog = ({ open, onClose, exam, previewRef, setSnackbar }) => {
    console.log(previewRef.current);

    const [shareLinks, setShareLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [emailSending, setEmailSending] = useState(false);

    const generatePdfLink = async (mode) => {
        if (!exam || !previewRef?.current) return null;

        const pdfBlob = await html2pdf()
            .set({ margin: [0, 0, 0, 0], html2canvas: { scale: 2 }, jsPDF: { unit: "mm", format: "a4" } })
            .from(previewRef.current)
            .outputPdf("blob");

        const formData = new FormData();
        formData.append("file", pdfBlob, `${exam.title}_${mode}.pdf`);
        const res = await uploadPdf(formData);
        const safeFilename = encodeURIComponent(res.id);
        return `${BASE_URL}/pdf/pdf/${safeFilename}`;
    };

    const handleGenerateLinks = async () => {
        setLoading(true);
        const links = [];
        const student = await generatePdfLink("student");
        if (student) links.push({ label: "שאלון", url: student });
        const teacher = await generatePdfLink("teacher");
        if (teacher) links.push({ label: "תשובות", url: teacher });
        setShareLinks(links);
        setLoading(false);
    };

    const handleCopy = (url, label) => {
        navigator.clipboard.writeText(url);
        setSnackbar({ open: true, message: `${label} הועתק ללוח!` });
    };

    const handleSendEmail = async () => {
        if (!email || !shareLinks.length) return;
        setEmailSending(true);
        try {
            const subject = `מבחן: ${exam.title}`;
            const bodyText = shareLinks.map(l => `${l.label}: ${l.url}`).join("\n");
            const bodyHtml = shareLinks.map(l => `<p>${l.label}: <a href="${l.url}">${l.url}</a></p>`).join("");
            const res = await fetch(`${BASE_URL}/pdf/send-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ to: email, subject, text: bodyText, html: bodyHtml })
            });
            if (!res.ok) throw new Error("שגיאה בשליחת המייל");
            setSnackbar({ open: true, message: "המייל נשלח בהצלחה!" });
            setEmail("");
        } catch (err) {
            console.error(err);
            setSnackbar({ open: true, message: "שגיאה בשליחת המייל" });
        } finally { setEmailSending(false); }
    };

    useEffect(() => {
        if (open) setShareLinks([]);
        // ריסט ללינקים בכל פתיחה
        handleGenerateLinks();
    }, [open]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{ direction: "rtl" }}>
            <DialogTitle>לינקים לשיתוף</DialogTitle>
            <DialogContent>
                {!shareLinks.length && !loading && (
                    <Button variant="contained" color="primary" onClick={handleGenerateLinks} sx={{ mb: 2 }}>
                        צור לינקים ל-PDF
                    </Button>
                )}

                {loading && <Typography sx={{ textAlign: "center", mt: 2 }}>טוען ...</Typography>}

                {shareLinks.map((item, index) => (

                    <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Typography >{item.label}</Typography>
                        <TextField
                            // label={item.label}
                            value={item.url}
                            fullWidth
                            InputProps={{
                                readOnly: true,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => handleCopy(item.url, item.label)}>
                                            <ContentCopyIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <QRCodeCanvas value={item.url} size={64} />
                    </Box>
                ))}
                <Divider sx={{ my: 2 }}>או</Divider>
                <Typography >שתף למייל</Typography>

                <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
                    <TextField label="מייל יעד" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
                    <IconButton color="primary" onClick={handleSendEmail} disabled={!email || emailSending}>
                        <EmailIcon />
                    </IconButton>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>סגור</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShareDialog;
