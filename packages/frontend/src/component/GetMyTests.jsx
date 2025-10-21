// src/components/MyTestsList.jsx
import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Stack,
    Button,
    Alert,
    TextField,
    MenuItem,
    Grid,
    IconButton,
    Collapse,
    Divider,
    Tooltip,
    Fab,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';

import { getExamsServiceByUser } from "../services/Exam.services";
import { useNavigate } from "react-router-dom";
import { Preview, Edit, Delete } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { deleteExamService } from "../services/Exam.services";


const MyTestsList = () => {
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // פילטרים
    const [search, setSearch] = useState("");
    const [subject, setSubject] = useState("");
    const [classroom, setClassroom] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedExamId, setSelectedExamId] = useState(null);

    const handleDeleteClick = (id) => {
        setSelectedExamId(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const res = await deleteExamService(selectedExamId);
            if (res.status === 200) {
                setExams((prev) => prev.filter((e) => e._id !== selectedExamId));
                setFiltered((prev) => prev.filter((e) => e._id !== selectedExamId));
            } else {
                alert("שגיאה במחיקת המבחן 😞");
            }
        } catch (err) {
            alert("שגיאה במחיקת המבחן 😞");
        } finally {
            setDeleteDialogOpen(false);
            setSelectedExamId(null);
        }
    };

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const res = await getExamsServiceByUser();
                setExams(res.data);
                setFiltered(res.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    setError("את לא מחוברת. התחברי כדי לראות את המבחנים שלך.");
                } else {
                    setError("שגיאה בטעינת המבחנים. נסי שוב מאוחר יותר.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

    // סינון
    useEffect(() => {
        let filteredExams = [...exams];

        if (search) {
            const s = search.toLowerCase();
            filteredExams = filteredExams.filter(
                (e) =>
                    e.title?.toLowerCase().includes(s) ||
                    e.subject?.toLowerCase().includes(s) ||
                    e.topic?.toLowerCase().includes(s) ||
                    e.classroom?.toLowerCase().includes(s)
            );
        }

        if (subject) filteredExams = filteredExams.filter((e) => e.subject === subject);
        if (classroom)
            filteredExams = filteredExams.filter((e) => e.classroom === classroom);

        setFiltered(filteredExams);
    }, [search, subject, classroom, exams]);

    if (loading)
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );

    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box
            sx={{
                maxWidth: 950,
                mx: "auto",
                mt: 5,
                direction: "rtl",
                textAlign: "right",
                px: 2,
            }}
        >
            {/* כותרת עליונה עם כפתור חיפוש */}
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2 }}
            >
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    המבחנים שלי
                </Typography>

                <IconButton
                    color="primary"
                    onClick={() => setShowFilters((prev) => !prev)}
                    sx={{
                        bgcolor: "#e3f2fd",
                        "&:hover": { bgcolor: "#bbdefb" },
                        borderRadius: "50%",
                    }}
                >
                    <Search />
                </IconButton>
            </Stack>

            {/* תיבת חיפוש נפתחת */}
            <Collapse in={showFilters}>
                <Card
                    variant="outlined"
                    sx={{
                        mb: 4,
                        p: 3,
                        bgcolor: "#fdfdfd",
                        borderRadius: "16px",
                        boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
                    }}
                >
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                // label="חיפוש חופשי"
                                placeholder="הקלידי שם מבחן, מקצוע, נושא או כיתה..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                InputLabelProps={{
                                    sx: { right: "10px", left: "unset", transformOrigin: "right" },
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                                    direction: "rtl",
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                select
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                displayEmpty
                                SelectProps={{
                                    displayEmpty: true,
                                    renderValue: (selected) =>
                                        selected ? (
                                            selected
                                        ) : (
                                            <span style={{ color: "#9e9e9e" }}> מקצוע</span>
                                        ),
                                    MenuProps: {
                                        PaperProps: { sx: { direction: "rtl" } },
                                    },
                                }}
                                sx={{
                                    width: "150px", // רוחב קבוע
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "14px",
                                        height: "56px", // גובה קבוע
                                        display: "flex",
                                        alignItems: "center",
                                    },
                                    "& .MuiSelect-select": {
                                        width: "100%", // התוכן תופס את כל הרוחב
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-start",
                                        textAlign: "right",
                                        fontSize: "1.1rem",
                                        fontWeight: 500,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        paddingRight: "12px",
                                    },
                                    direction: "rtl",
                                }}
                            >
                                <MenuItem value="">הכל</MenuItem>
                                {[...new Set(exams.map((e) => e.subject))].map((sub) => (
                                    <MenuItem key={sub} value={sub} sx={{ fontSize: "1.05rem" }}>
                                        {sub}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                select
                                value={classroom}
                                onChange={(e) => setClassroom(e.target.value)}
                                displayEmpty
                                SelectProps={{
                                    displayEmpty: true,
                                    renderValue: (selected) =>
                                        selected ? (
                                            selected
                                        ) : (
                                            <span style={{ color: "#9e9e9e" }}>כיתה</span>
                                        ),
                                    MenuProps: {
                                        PaperProps: { sx: { direction: "rtl" } },
                                    },
                                }}
                                sx={{
                                    width: "90px", // רוחב קבוע
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "14px",
                                        height: "56px", // גובה קבוע
                                        display: "flex",
                                        alignItems: "center",
                                    },
                                    "& .MuiSelect-select": {
                                        width: "100%", // התוכן תופס את כל הרוחב
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-start",
                                        textAlign: "right",
                                        fontSize: "1.1rem",
                                        fontWeight: 500,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        paddingRight: "12px",
                                    },
                                    direction: "rtl",
                                }}
                            >
                                <MenuItem value="">הכל</MenuItem>
                                {[...new Set(exams.map((e) => e.classroom))].map((classroom) => (
                                    <MenuItem key={classroom} value={classroom} sx={{ fontSize: "1.05rem" }}>
                                        {classroom}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                </Card>
            </Collapse>

            {/* רשימת מבחנים */}
            {filtered.length === 0 ? (
                <Typography align="center" sx={{ mt: 5, color: "gray" }}>
                    😕 לא נמצאו מבחנים התואמים לחיפוש שלך
                </Typography>
            ) : (
                <Stack spacing={2}>
                    {filtered.map((exam) => (
                        <Card
                            key={exam._id}
                            variant="outlined"
                            sx={{
                                borderRadius: "16px",
                                boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
                                transition: "0.2s",
                                "&:hover": { boxShadow: "0 4px 14px rgba(0,0,0,0.15)" },
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                    {exam.title}
                                </Typography>
                                <Divider sx={{ my: 1.5 }} />
                                <Typography color="textSecondary">מקצוע: {exam.subject}</Typography>
                                <Typography color="textSecondary">נושא: {exam.topic}</Typography>
                                <Typography color="textSecondary">כיתה: {exam.classroom}</Typography>
                                <Typography color="textSecondary" sx={{ mb: 2 }}>
                                    תאריך יצירה:{" "}
                                    {new Date(exam.createdAt).toLocaleDateString("he-IL")}
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    <IconButton
                                        color="primary"
                                        onClick={() => navigate(`/export-exam/${exam._id}`)}
                                        title="צפה במבחן"
                                    >
                                        <Preview />
                                    </IconButton>

                                    <IconButton
                                        color="secondary"
                                        onClick={() => navigate(`/edit-exam/${exam._id}`)}
                                        title="עריכה"
                                    >
                                        <Edit />
                                    </IconButton>

                                    <IconButton
                                        color="error"
                                        onClick={() => handleDeleteClick(exam._id)}
                                        title="מחיקה"
                                    >
                                        <Delete />
                                    </IconButton>
                                </Stack>


                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}
            {/* כפתור יצירת מבחן חדש */}
            <Tooltip title="יצירת מבחן חדש" placement="left">
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{
                        mt: 2, // מרווח מעל
                        backgroundColor: '#3B6B7F',
                        ":hover": {
                            backgroundColor: 'brown',
                        }
                    }}
                    onClick={() => navigate('/create-exam')}
                >
                    <AddIcon />
                </Fab>
            </Tooltip>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                dir="rtl"
            >
                <DialogTitle>אישור מחיקה</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        האם את בטוחה שברצונך למחוק את המבחן הזה? לא ניתן לשחזר אותו לאחר מכן.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
                        ביטול
                    </Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        מחקי
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MyTestsList;
