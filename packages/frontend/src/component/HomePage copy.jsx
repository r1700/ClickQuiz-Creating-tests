import React, { useState, useEffect, useContext } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    Grid,
    Card,
    CardContent,
    Avatar,
    Paper,
    IconButton,
    Stack,
    Divider
} from "@mui/material";
import { styled, keyframes } from "@mui/system";
// import Logo from "../assets/clickquiz-logo.png";
import Logo from "../assets/quiz.png";
import { AutoAwesome, Create, Share, LibraryBooks, ArrowBackIos, ArrowForwardIos, EditNote, PictureAsPdf, Group, Science, RocketLaunch } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AuthContext } from "../context/AuthContext";


// צבעים
const PRIMARY_COLOR = "#002275";
const SECONDARY_COLOR = "#14B0FF";
const ACCENT_COLOR = "#FFB300";
const LIGHT_BG = "#F6F9FB";

// אנימציות
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;
const pulse = keyframes`
  0% { transform: scale(1);}
  50% { transform: scale(1.05);}
  100% { transform: scale(1);}
`;

// Hero Section
const Hero = styled(Box)({
    background: `linear-gradient(120deg, ${PRIMARY_COLOR} 0%, ${SECONDARY_COLOR} 60%)`,
    color: "#fff",
    padding: "64px 20px",
    borderRadius: 12,
    marginTop: 16,
    position: "relative",
    overflow: "hidden",
});

// Floating shapes ב-Hero
const FloatingShape = styled(Box)(({ top, left, size, opacity }) => ({
    position: "absolute",
    top,
    left,
    width: size,
    height: size,
    borderRadius: "50%",
    backgroundColor: "#fff",
    opacity,
    filter: "blur(50px)",
    animation: "float 6s ease-in-out infinite",
    "@keyframes float": {
        "0%,100%": { transform: "translateY(0px)" },
        "50%": { transform: "translateY(-20px)" },
    },
}));

// GlassCard
const GlassCard = styled(Card)({
    backdropFilter: "blur(6px)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.72))",
    borderRadius: 14,
    boxShadow: "0 8px 24px rgba(10,20,30,0.06)",
});

// Feature Icon
const FeatureIcon = styled(Avatar)({
    width: 56,
    height: 56,
    background: "rgba(255,255,255,0.14)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
});

// CTA Button
const CTA = styled(Button)({
    background: `linear-gradient(90deg, ${ACCENT_COLOR}, #FF9A00)`,
    color: "#07122b",
    padding: "12px 28px",
    borderRadius: 12,
    fontWeight: 700,
    animation: `${pulse} 2s infinite`,
    "&:hover": { background: "#FFA000" },
});

// Feature Card Component
const FeatureCard = ({ icon, title, text }) => (
    <GlassCard
        sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            height: 200, // גובה אחיד
            width: 200, // רוחב אחיד
            transition: "0.3s",
            "&:hover": { transform: "translateY(-10px)", boxShadow: "0 20px 40px rgba(0,0,0,0.15)" },
        }}
    >
        <Box display="flex" alignItems="center" gap={2} mb={2}>
            <FeatureIcon sx={{ bgcolor: "rgba(24, 74, 191, 0.14)" }}>{icon}</FeatureIcon>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {title}
            </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">{text}</Typography>
    </GlassCard>
);

// Data
const features = [
    { key: "content", icon: <AutoAwesome />, title: "יצירת תוכן חכם", text: "שאלות מותאמות לנושא ולרמה תוך דקות." },
    { key: "edit", icon: <EditNote />, title: "עריכה מהירה", text: "שדרוג ניסוחים ותיקון תשובות בקלות." },
    { key: "export", icon: <PictureAsPdf />, title: "ייצוא ושיתוף", text: "הורדה, הדפסה או שיתוף במייל ו־QR Code." },
    { key: "team", icon: <Group />, title: "עבודה בצוות", text: "שיתוף מבחנים ועדכון משאבים משותף." },
    { key: "science", icon: <Science />, title: "תוכן מקצועי", text: "שאלות תואמות לתוכנית הלימודים." },
    { key: "speed", icon: <RocketLaunch />, title: "חיסכון בזמן", text: "תבניות מוכנות ועבודה מהירה." },
];

const testimonials = [
    { name: "רבקה מ.", text: "מערכת חכמה שמקצרת לי שעות עבודה מדי שבוע." },
    { name: "גלית ל.", text: "מעולה — AI שיודע לייצר שאלות מותאמות." },
    { name: "שרון פ.", text: "שיתוף מהיר עם תלמידים בעזרת QR וקישור." },
];

// Component
const HomePageAnimatedStyled = () => {
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate();
    // const token = Cookies.get("token");
    // const isLoggedIn = Boolean(token);
    const { user, isLoggedIn, loading } = useContext(AuthContext);
    // if (loading) return <div>טוען...</div>;

    console.log(user);
    console.log(" 😓  isLoggedIn:", isLoggedIn);

    useEffect(() => {
        const interval = setInterval(() => setCurrent((s) => (s + 1) % testimonials.length), 4500);
        return () => clearInterval(interval);
    }, []);

    const prevTestimonial = () => setCurrent((s) => (s - 1 + testimonials.length) % testimonials.length);
    const nextTestimonial = () => setCurrent((s) => (s + 1) % testimonials.length);
    const funcClearCookies = async () => {
        console.log("Clearing cookies...");

        await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, { method: "GET", credentials: "include" });
        Cookies.remove("token");
        Cookies.remove("userName");
        console.log("Clearing 2222...");

        // לאחר ניקוי העוגיות, ניתן לנתב מחדש או לעדכן את המצב
    };

    return (
        <Box sx={{ direction: "rtl", background: LIGHT_BG, minHeight: "100vh", pb: 8, marginTop: 0 }}>
            <Button sx={{ mt: 2, ml: 2 }} onClick={() => funcClearCookies()}>נקה עוגיות</Button>
            {/* Hero */}
            <Container maxWidth="lg">
                <Hero sx={{ mt: 2, animation: `${fadeIn} .7s ease-out` }}>
                    <FloatingShape top="10%" left="5%" size="180px" opacity={0.15} />
                    <FloatingShape top="40%" left="70%" size="250px" opacity={0.1} />

                    <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.06 }}>{`יצירת מבחנים מקצועית — בפחות זמן`}</Typography>
                    <Typography sx={{ mt: 2, color: "rgba(255,255,255,0.92)" }}>
                        השתמשי ב‑AI ליצירת שאלות אוטומטית, סדרי וערכי מבחנים בקלות, ושיתפי עם תלמידות מהשיעור.
                    </Typography>

                    <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <CTA onClick={() => { isLoggedIn ? navigate("/create-exam") : navigate("/login") }}>התחילי עכשיו</CTA>
                        {isLoggedIn && <Button
                            variant="outlined"
                            sx={{
                                borderRadius: 4,
                                fontWeight: 700,
                                color: ACCENT_COLOR,
                                borderColor: ACCENT_COLOR
                            }}
                            onClick={() => { navigate("/get-my-exams") }}>המבחנים שלי</Button>}
                    </Box>
                </Hero>

                {/* פונקציות */}
                <Box sx={{ mt: 6, alignItems: "center" }}>
                    {/* <Typography variant="h4" align="center" sx={{ fontWeight: 800, mb: 3 }}>פונקציות עיקריות</Typography> */}
                    <Grid container spacing={2} justifyContent="center" margin=" 0 80px 0 80px">
                        {features.map((f) => (
                            <Grid item xs={12} sm={6} md={4} key={f.key}>
                                <FeatureCard icon={f.icon} title={f.title} text={f.text} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* אודות */}
                <Box
                    id="about-section"
                    sx={{
                        mt: 10,
                        py: 8,
                        px: 3,
                        textAlign: "center",
                        // backgroundColor: "white",
                        borderTop: `4px solid ${PRIMARY_COLOR}`,
                        borderBottom: `4px solid ${PRIMARY_COLOR}`,
                        // boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                    }}
                >

                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 800, mb: 3, color: PRIMARY_COLOR }}
                    >
                        אודות ClickQuiz
                    </Typography>

                    <Container maxWidth="md">
                        <Typography
                            variant="body1"
                            sx={{
                                color: "text.secondary",
                                lineHeight: 1.9,
                                textAlign: "justify",
                                fontSize: "1.05rem",
                            }}
                        >
                            הרעיון ל־ClickQuiz נולד מתוך צורך אמיתי של מורות ואנשי חינוך —
                            לחסוך את הזמן היקר שמתבזבז על בניית מבחנים ושאלונים בצורה ידנית.
                            במהלך העבודה בבתי ספר ובפרויקטים חינוכיים גילינו עד כמה התהליך הזה
                            גוזל אנרגיה, ומשאיר פחות זמן להתמקדות בהוראה עצמה.
                            <br /><br />
                            מתוך ההבנה הזו החלטנו לפתח מערכת שתשלב בין טכנולוגיה מתקדמת ליצירתיות
                            חינוכית. המטרה שלנו הייתה לבנות כלי פשוט, מהיר ונגיש שיאפשר לכל מורה
                            ליצור מבחנים איכותיים תוך דקות — בעזרת בינה מלאכותית שמבינה את צרכי ההוראה.
                            <br /><br />
                            ClickQuiz פותחה מתוך אהבה לעולם החינוך והרצון להקל על מורות
                            ומורים בכל שלב בעבודתם. המערכת מאפשרת ליצור שאלות מותאמות לפי נושא ורמה,
                            לערוך מבחנים קיימים, לשמור, לשתף ולהפיק גרסאות להדפסה או שליחה דיגיטלית.
                            <br /><br />
                            החזון שלנו הוא להמשיך ולפתח את ClickQuiz כך שתהפוך לכלי מרכזי בעבודת ההוראה —
                            כזה שמחבר בין פדגוגיה, חדשנות וטכנולוגיה.
                            אנחנו מאמינים שכל מורה ראויה לכלים חכמים שיחסכו זמן ויאפשרו לה להתמקד במה שבאמת חשוב —
                            בלמידה ובהשראה.
                        </Typography>
                    </Container>
                </Box>

                {/* המלצות */}
                <Box id="testimonials-section" sx={{ mt: 10 }}>
                    <Typography variant="h4" align="center" gutterBottom sx={{ mb: 3 }}>מה מורות אומרות</Typography>
                    <Box sx={{ maxWidth: 500, mx: "auto", position: "relative" }}>
                        <GlassCard sx={{ p: 3, textAlign: "center", mb: 2, animation: `${fadeIn} 1s ease-out` }}>
                            <Avatar sx={{ bgcolor: SECONDARY_COLOR, mb: 1 }}>{testimonials[current].name[0]}</Avatar>
                            <Typography variant="body1" sx={{ fontWeight: 700 }}>{testimonials[current].name}</Typography>
                            <Typography variant="body2" color="text.secondary">{testimonials[current].text}</Typography>
                        </GlassCard>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <IconButton onClick={nextTestimonial}><ArrowForwardIos /></IconButton>
                            <IconButton onClick={prevTestimonial}><ArrowBackIos /></IconButton>
                        </Stack>
                    </Box>
                </Box>
            </Container>

            {/* Footer */}
            <Box sx={{ mt: 8, background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`, color: "white", py: 5 }}>
                <Container sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2">© 2025 ClickQuiz — כל הזכויות שמורות</Typography>
                    <Box>
                        <Button color="inherit">אודות</Button>
                        <Button color="inherit">פרטיות</Button>
                        <Button color="inherit">צור קשר</Button>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default HomePageAnimatedStyled;
