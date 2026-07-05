// ...existing code...
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
    Avatar,
    Chip,
    Paper,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';

import { getExamsServiceByUser } from "../services/Exam.services";
import { useNavigate } from "react-router-dom";
import { Preview, Edit, Delete } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { deleteExamService } from "../services/Exam.services";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// צבעים
const PRIMARY_COLOR = "#002275";
const SECONDARY_COLOR = "#3B6B7F";
const ACCENT_COLOR = "#FFB300";
const LIGHT_BG = "#F6F9FB";

const MyTestsList = () => {
    const { user } = useContext(AuthContext);
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
        if (!user) {
            setLoading(false);
            return;
        }
        const fetchExams = async () => {
            try {
                const res = await getExamsServiceByUser();
                setExams(res.data);
                setFiltered(res.data);
            } catch (err) {
                setError("שגיאה בטעינת המבחנים. נסי שוב מאוחר יותר.");
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, [user]);

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
        if (classroom) filteredExams = filteredExams.filter((e) => e.classroom === classroom);
        setFiltered(filteredExams);
    }, [search, subject, classroom, exams]);

    if (loading)
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <CircularProgress />
            </Box>
        );

    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ bgcolor: LIGHT_BG }}>
            <Box
                sx={{
                    maxWidth: 1100,
                    mx: "auto",
                    mt: 4,
                    direction: "rtl",
                    textAlign: "right",
                    px: { xs: 2, md: 3 },
                    marginTop: 0,
                }}
            >
                {/* כותרת */}
                <Paper
                    elevation={2}
                    sx={{
                        p: 2,
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "linear-gradient(90deg,#f7fbfc,#eef7fa)",
                        borderRadius: "12px",
                    }}
                >
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                המבחנים שלי
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: "none", md: "block" } }}>
                                ניהול, עריכה ושיתוף של מבחנים שנוצרו על ידיך
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <Tooltip title="יצירת מבחן חדש">
                            <Button
                                variant="contained"
                                onClick={() => navigate("/create-exam")}
                                startIcon={<AddIcon />}
                                sx={{ bgcolor: ACCENT_COLOR, minWidth: 0, px: { xs: 1, md: 2 } }}
                            >
                                <Box sx={{ display: { xs: "none", md: "block" } }}>
                                    יצירת מבחן חדש
                                </Box>
                            </Button>
                        </Tooltip>

                        <IconButton
                            color="primary"
                            onClick={() => setShowFilters((prev) => !prev)}
                            sx={{
                                bgcolor: "#ffffff",
                                borderRadius: "10px",
                                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                            }}
                        >
                            <Search />
                        </IconButton>
                    </Stack>
                </Paper>

                {/* פילטרים */}
                <Collapse in={showFilters}>
                    <Card
                        variant="outlined"
                        sx={{
                            mb: 3,
                            p: 3,
                            bgcolor: "#ffffff",
                            borderRadius: "12px",
                            boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
                        }}
                    >
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    placeholder="הקלידי שם מבחן, מקצוע, נושא או כיתה..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
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
                                    onChange={(e) => setSubject(e.target.value)}
                                    SelectProps={{
                                        displayEmpty: true,
                                        renderValue: (selected) =>
                                            selected ? selected : <span style={{ color: "#9e9e9e" }}>מקצוע</span>,
                                        MenuProps: { PaperProps: { sx: { direction: "rtl" } } },
                                    }}
                                    sx={{
                                        width: "100%",
                                        "& .MuiOutlinedInput-root": { borderRadius: "12px", height: 52 },
                                        direction: "rtl",
                                    }}
                                >
                                    <MenuItem value="">הכל</MenuItem>
                                    {[...new Set(exams.map((e) => e.subject))].map((sub) => (
                                        <MenuItem key={sub} value={sub}>{sub}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6} sm={3} md={2}>
                                <TextField
                                    select
                                    value={classroom}
                                    onChange={(e) => setClassroom(e.target.value)}
                                    SelectProps={{
                                        displayEmpty: true,
                                        renderValue: (selected) =>
                                            selected ? selected : <span style={{ color: "#9e9e9e" }}>כיתה</span>,
                                        MenuProps: { PaperProps: { sx: { direction: "rtl" } } },
                                    }}
                                    sx={{
                                        width: "100%",
                                        "& .MuiOutlinedInput-root": { borderRadius: "12px", height: 52 },
                                        direction: "rtl",
                                    }}
                                >
                                    <MenuItem value="">הכל</MenuItem>
                                    {[...new Set(exams.map((e) => e.classroom))].map((cr) => (
                                        <MenuItem key={cr} value={cr}>{cr}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={2} sx={{ textAlign: "left" }}>
                                <Button variant="outlined" onClick={() => { setSearch(""); setSubject(""); setClassroom(""); }}>
                                    נקה
                                </Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Collapse>

                {/* רשימת מבחנים */}
                {filtered.length === 0 ? (
                    <Box sx={{ textAlign: "center", mt: 6 }}>
                        <Typography variant="h6" sx={{ color: "text.secondary", mb: 1 }}>
                            😕 {!user ? "התחברי כדי לראות את המבחנים שלך" : "אין לך מבחנים עדיין"}
                        </Typography>
                        {!user ? (
                            <Button variant="contained" onClick={() => navigate("/login")}>התחברות</Button>
                        ) : (
                            <Button variant="contained" onClick={() => navigate("/create-exam")}>צור מבחן ראשון</Button>
                        )}
                    </Box>
                ) : (
                    <Stack spacing={2}>
                        {filtered.map((exam) => (
                            <Card
                                key={exam._id}
                                variant="outlined"
                                sx={{
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    transition: "transform 0.14s, box-shadow 0.14s",
                                    "&:hover": { transform: "translateY(-4px)", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" },
                                }}
                            >
                                <CardContent sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 }, p: { xs: 1.5, md: 2 } }}>

                                    {/* Avatar - רק בדסקטופ */}
                                    <Avatar
                                        sx={{
                                            display: { xs: "none", md: "flex" },
                                            bgcolor: "#4a90a4",
                                            width: 64,
                                            height: 64,
                                            fontWeight: 700,
                                            fontSize: "1.05rem",
                                        }}
                                    >
                                        {String(exam.title || "מבחן").slice(6, 7).toUpperCase()}
                                    </Avatar>

                                    {/* תוכן */}
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ minWidth: 0 }}>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 700 }} noWrap>
                                                    {exam.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" noWrap>
                                                    נושא: {exam.topic || "-"}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={`כיתה ${exam.classroom}`}
                                                variant="outlined"
                                                size="small"
                                                sx={{ flexShrink: 0, ml: 1 }}
                                            />
                                        </Stack>
                                        <Divider sx={{ my: 1.2 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            תאריך יצירה: {new Date(exam.createdAt).toLocaleDateString("he-IL")}
                                        </Typography>
                                    </Box>

                                    {/* כפתורי פעולה */}
                                    <Stack direction="column" spacing={1}>
                                        <Tooltip title="צפה במבחן">
                                            <IconButton
                                                sx={{ color: SECONDARY_COLOR, width: { xs: 30, md: 40 }, height: { xs: 30, md: 40 } }}
                                                onClick={() => navigate(`/export-exam/${exam._id}`)}
                                            >
                                                <Preview sx={{ fontSize: { xs: "1rem", md: "1.5rem" } }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="ערוך">
                                            <IconButton
                                                sx={{ bgcolor: SECONDARY_COLOR, color: "white", width: { xs: 30, md: 40 }, height: { xs: 30, md: 40 } }}
                                                onClick={() => navigate(`/edit-exam/${exam._id}`)}
                                            >
                                                <Edit sx={{ fontSize: { xs: "1rem", md: "1.5rem" } }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="מחק">
                                            <IconButton
                                                sx={{ bgcolor: ACCENT_COLOR, color: "white", width: { xs: 30, md: 40 }, height: { xs: 30, md: 40 } }}
                                                onClick={() => handleDeleteClick(exam._id)}
                                            >
                                                <Delete sx={{ fontSize: { xs: "1rem", md: "1.5rem" } }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                )}

                {/* כפתור צף */}
                <Tooltip title="יצירת מבחן חדש" placement="left">
                    <Fab
                        color="primary"
                        aria-label="add"
                        sx={{
                            position: "fixed",
                            bottom: 24,
                            left: 24,
                            backgroundColor: '#3B6B7F',
                            ":hover": { backgroundColor: '#355a65' },
                        }}
                        onClick={() => navigate('/create-exam')}
                    >
                        <AddIcon />
                    </Fab>
                </Tooltip>

                {/* דיאלוג מחיקה */}
                <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} dir="rtl">
                    <DialogTitle>אישור מחיקה</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            האם את בטוחה שברצונך למחוק את המבחן הזה? לא ניתן לשחזר אותו לאחר מכן.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">ביטול</Button>
                        <Button onClick={confirmDelete} color="error" variant="contained">מחק</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default MyTestsList;
// ...existing code...