import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    Container,
    Grid,
    Card,
    CardContent,
    Stack,
    Avatar,
    Divider,
    AppBar,
    Toolbar,
    IconButton,
    Grow,
} from "@mui/material";
import {
    AutoAwesome,
    EditNote,
    PictureAsPdf,
    Group,
    Science,
    RocketLaunch,
    Menu as MenuIcon,
} from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/clickquiz-logo.png";

const ICON_STYLE = { fontSize: 22, color: "#1e88e5" };

// animation keyframes
const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0); }
`;
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;
const fadeUp = keyframes`
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const HomePage = () => {
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // trigger entrance animations
        const id = setTimeout(() => setMounted(true), 80);
        return () => clearTimeout(id);
    }, []);

    return (
        <Box sx={{ bgcolor: "#f6f8fb", minHeight: "100vh", direction: "rtl", color: "#0b1b2b" }}>
            {/* Top bar */}
            <AppBar position="static" elevation={0} color="transparent" sx={{ py: 1 }}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ display: { md: "none" } }}>
                            <MenuIcon />
                        </IconButton>
                        <Box
                            component="img"
                            src={Logo}
                            alt="logo"
                            sx={{
                                height: 36,
                                animation: `${float} 4s ease-in-out infinite`,
                                transformOrigin: "center",
                            }}
                        />
                        <Typography variant="subtitle1" sx={{ ml: 1, display: { xs: "none", md: "block" } }}>
                            ClickQuiz
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                        <Button variant="text" onClick={() => navigate("/get-my-exams")} sx={{ color: "#0b1b2b" }}>
                            המבחנים שלי
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => navigate("/create-exam")}
                            sx={{
                                animation: `${pulse} 2.2s ease-in-out infinite`,
                                "&:hover": { transform: "scale(1.02)" },
                            }}
                        >
                            צור מבחן
                        </Button>
                    </Stack>
                </Toolbar>
            </AppBar>

            {/* Hero */}
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box sx={{ maxWidth: 640 }}>
                            <Grow in={mounted} timeout={700}>
                                <Typography variant="h4" fontWeight={800} sx={{ mb: 2, animation: `${fadeUp} 700ms ease both` }}>
                                    הכנת מבחנים — מהירה וממוקדת
                                </Typography>
                            </Grow>

                            <Grow in={mounted} style={{ transitionDelay: "150ms" }}>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6, animation: `${fadeUp} 800ms ease both` }}>
                                    כלי נקי ופשוט שמייצר שאלות מותאמות לכיתה, מאפשר עריכה מהירה ושיתוף בקלות.
                                    חוסך זמן ומאפשר להתמקד בהוראה.
                                </Typography>
                            </Grow>

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate("/create-exam")}
                                    sx={{
                                        boxShadow: 3,
                                        borderRadius: 2,
                                        "&:hover": { transform: "translateY(-3px)" },
                                        transition: "transform 200ms ease",
                                    }}
                                >
                                    צור מבחן חדש
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => navigate("/get-my-exams")}
                                    sx={{
                                        borderRadius: 2,
                                        "&:hover": { transform: "translateY(-3px)" },
                                        transition: "transform 200ms ease",
                                    }}
                                >
                                    עיין במבחנים
                                </Button>
                            </Stack>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Grow in={mounted} timeout={900} style={{ transformOrigin: "0 0" }}>
                            <Card
                                sx={{
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    overflow: "visible",
                                    position: "relative",
                                }}
                            >
                                <CardContent>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        דוגמה מהירה
                                    </Typography>
                                    <Typography variant="h6" fontWeight={700} sx={{ mt: 1 }}>
                                        מדעים — כיתה ח' — רמת ביניים
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                                        מהי התגובה בין חומצה לבסיס שמייצרת גז? בחרי את התשובה הנכונה.
                                    </Typography>
                                    <Stack direction="row" spacing={1}>
                                        <Button variant="outlined" size="small">הצג שאלה</Button>
                                        <Button variant="text" size="small" onClick={() => alert("הורדת PDF תתווסף בקרוב")}>
                                            הורד PDF
                                        </Button>
                                    </Stack>

                                    {/* floating badge */}
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: -16,
                                            right: 16,
                                            bgcolor: "#1e88e5",
                                            color: "white",
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: 2,
                                            fontWeight: 700,
                                            boxShadow: 4,
                                            animation: `${float} 3.8s ease-in-out infinite`,
                                            fontSize: 12,
                                        }}
                                    >
                                        הדגמה חיה
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grow>
                    </Grid>
                </Grid>
            </Container>

            {/* Features */}
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Typography variant="h6" fontWeight={800} align="center" sx={{ mb: 4 }}>
                    מה מקבלים
                </Typography>

                <Grid container spacing={3}>
                    {[
                        { icon: <AutoAwesome sx={ICON_STYLE} />, title: "יצירת תוכן חכם", desc: "שאלות מותאמות לנושא ולרמה תוך דקות." },
                        { icon: <EditNote sx={ICON_STYLE} />, title: "עריכה מהירה", desc: "שדרוג ניסוחים ותיקון תשובות בקלות." },
                        { icon: <PictureAsPdf sx={ICON_STYLE} />, title: "ייצוא ושיתוף", desc: "הורדה כ‑PDF ושיתוף מהיר לתלמידים." },
                        { icon: <Group sx={ICON_STYLE} />, title: "עבודה בצוות", desc: "שיתוף מבחנים ועדכון משאבים משותף." },
                        { icon: <Science sx={ICON_STYLE} />, title: "תוכן מקצועי", desc: "שאלות תואמות לתוכנית הלימודים." },
                        { icon: <RocketLaunch sx={ICON_STYLE} />, title: "חיסכון בזמן", desc: "תבניות מוכנות ועבודה מהירה." },
                    ].map((f, i) => (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                            <Grow in={mounted} style={{ transitionDelay: `${200 + i * 100}ms` }}>
                                <Card
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        boxShadow: 1,
                                        bgcolor: "white",
                                        cursor: "default",
                                        transformOrigin: "center",
                                        "&:hover": {
                                            transform: "translateY(-8px) scale(1.01)",
                                            boxShadow: 6,
                                        },
                                        transition: "transform 300ms ease, box-shadow 300ms ease",
                                    }}
                                >
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar sx={{ bgcolor: "#eaf3ff", color: "#1e88e5", animation: `${float} ${4 + (i % 3)}s ease-in-out infinite` }}>
                                            {f.icon}
                                        </Avatar>
                                        <Box>
                                            <Typography fontWeight={700}>{f.title}</Typography>
                                            <Typography color="text.secondary" sx={{ fontSize: 13 }}>{f.desc}</Typography>
                                        </Box>
                                    </Stack>
                                </Card>
                            </Grow>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Simple example */}
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={7}>
                        <Grow in={mounted} style={{ transitionDelay: "300ms" }}>
                            <Typography variant="h6" fontWeight={700} sx={{ animation: `${fadeUp} 700ms ease both` }}>
                                ניסוי קצר לכיתה
                            </Typography>
                        </Grow>
                        <Grow in={mounted} style={{ transitionDelay: "350ms" }}>
                            <Typography color="text.secondary" sx={{ mt: 1 }}>
                                רעיון להצגה בכיתה: חיבור חומץ וסודה לשתייה כהדגמה לתגובה כימית — ניתן להפוך לשאלה קצרה לתלמידים.
                            </Typography>
                        </Grow>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Grow in={mounted} style={{ transitionDelay: "420ms" }}>
                            <Box component="img" src="https://cdn-icons-png.flaticon.com/512/7996/7996928.png" alt="ניסוי" sx={{ width: 160, mx: "auto", display: "block", transform: "rotate(-6deg)" }} />
                        </Grow>
                    </Grid>
                </Grid>
            </Container>

            {/* Testimonials */}
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h6" align="center" fontWeight={700} sx={{ mb: 3 }}>
                    מה המורות מספרות
                </Typography>

                <Grid container spacing={2} justifyContent="center">
                    {[
                        { name: "ד\"ר רונית כהן", text: "חיסכון בזמן והנאה רבה של התלמידים." },
                        { name: "נועה לוי", text: "כלי פשוט שמקל על העבודה היומיומית." },
                    ].map((t, i) => (
                        <Grid item xs={12} md={5} key={i}>
                            <Grow in={mounted} style={{ transitionDelay: `${380 + i * 120}ms` }}>
                                <Card sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
                                    <Typography sx={{ mb: 1, color: "text.secondary" }}>{t.text}</Typography>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography fontWeight={700} variant="subtitle2">{t.name}</Typography>
                                </Card>
                            </Grow>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Footer */}
            <Box sx={{ bgcolor: "#ffffff", borderTop: "1px solid #e6eefb", py: 3, mt: 6 }}>
                <Container maxWidth="lg">
                    <Grid container alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">© {new Date().getFullYear()} ClickQuiz</Typography>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ textAlign: { xs: "right", md: "left" } }}>
                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                                <Button variant="text" sx={{ color: "text.secondary" }}>תנאי שימוש</Button>
                                <Button variant="text" sx={{ color: "text.secondary" }}>מדיניות פרטיות</Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default HomePage;
