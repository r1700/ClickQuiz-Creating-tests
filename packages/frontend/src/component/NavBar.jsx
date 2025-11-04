// components/Sidebar.tsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/quiz.png";
import { AppBar, Avatar, Box, Button, Container, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { AuthContext } from '../context/AuthContext';



// צבעים
const PRIMARY_COLOR = "#002275";
const SECONDARY_COLOR = "#14B0FF";
const ACCENT_COLOR = "#FFB300";
const LIGHT_BG = "#F6F9FB";
const NavBar = () => {
    const { user, isLoggedIn, loading, LogOut } = useContext(AuthContext);
    const navigate = useNavigate();

    const scrollToElement = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };
    // תפריט משתמש
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
  

    const handleLogout = async () => {
        try {
             console.log(user);
            console.log(isLoggedIn);
            await LogOut();
            // user = null;
            // isLoggedIn = false;
            console.log(user);
            console.log(isLoggedIn);
            navigate("/");

        } catch (error) {
            console.error("❌ שגיאה ביציאה:", error);
        }
    };


    return (
        <Box sx={{ direction: "rtl", background: LIGHT_BG }}>
            {loading && <div>טוען...</div>}
            <AppBar position="static" sx={{ background: "transparent", boxShadow: "none", pt: 1, direction: "rtl" }}>
                <Container>
                    <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <img src={Logo} alt="ClickQuiz logo" style={{ width: 140 }} />
                            <Typography variant="subtitle1" color="text.secondary">יצירת מבחנים מהירה ומקצועית</Typography>
                        </Box>
                        <Box>
                            <Button sx={{ color: PRIMARY_COLOR }} onClick={() => navigate("/")}>בית</Button>
                            <Button sx={{ color: PRIMARY_COLOR }} onClick={() => navigate("/create-exam")}>צור מבחן</Button>
                            <Button sx={{ color: PRIMARY_COLOR }} onClick={() => navigate("/get-my-exams")}>המבחנים שלי</Button>
                            <Button sx={{ color: PRIMARY_COLOR }} onClick={() => scrollToElement("about-section")}>אודות</Button>
                            <Button sx={{ color: PRIMARY_COLOR }} onClick={() => scrollToElement("testimonials-section")}>המלצות</Button>
                            {/* <Button sx={{ bgcolor: ACCENT_COLOR, color: "#ffff" }} > {isLoggedIn ? `שלום, ${user.name}!` : "התחבר/י"}</Button> */}
                        </Box>
                    </Toolbar>

                    {/* אם לא מחובר - כפתור הרשמה */}
                    {!isLoggedIn && (
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                position: "absolute",
                                left: 16,
                                top: 16,
                                zIndex: 2,
                                backgroundColor: SECONDARY_COLOR,
                                color: "white"
                            }}
                            onClick={() => navigate('/login')}
                        >
                            הרשמה
                        </Button>
                    )}
                    {/* אם מחובר - שלום א... + תפריט */}
                    {isLoggedIn && (
                        <Box sx={{ position: "absolute", left: 16, top: 16, zIndex: 2, display: 'flex', alignItems: 'center' }}>
                            <Button
                                sx={{ color: SECONDARY_COLOR, textAlign: "right" }}
                                color="inherit"
                                onClick={handleMenuOpen}
                                startIcon={<Avatar sx={{ bgcolor: SECONDARY_COLOR, color: "white" }}>{user.name[0]}</Avatar>}
                            >
                                שלום {user.name}
                            </Button>
                            {/* תפריט משתמש */}
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={() => {
                                    handleMenuClose(); setEditDialogOpen(true); // פתיחת דיאלוג
                                }}>
                                    עריכת משתמש
                                </MenuItem>
                                <MenuItem onClick={() => { handleMenuClose(); navigate('/login'); }}>הרשמה חדשה</MenuItem>
                                <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>התנתקות</MenuItem>
                            </Menu>

                        </Box>
                    )}
                </Container>
            </AppBar>
        </Box>
    );
};

export default NavBar;
