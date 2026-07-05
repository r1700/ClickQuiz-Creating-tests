// components/NavBar
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/quiz.png";
import { AppBar, Avatar, Box, Button, Container, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import Cookies from "js-cookie";

// צבעים
const PRIMARY_COLOR = "#002275";
const SECONDARY_COLOR = "#14B0FF";
const ACCENT_COLOR = "#FFB300";
const LIGHT_BG = "#F6F9FB";

const NavBar = () => {
    const { user, isLoggedIn, loading, LogOut } = useContext(AuthContext);
    const navigate = useNavigate();

    const scrollToElement = (id) => {
        if (window.location.pathname !== "/") {
            navigate("/");
            setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
            }, 300);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }
    };

    // תפריט משתמש
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);


    const handleLogout = async () => {
        try {
            await LogOut();
            Cookies.remove("token");
            Cookies.remove("userName");
            navigate("/");
        } catch (error) {
            console.error("❌ שגיאה ביציאה:", error);
        }
    };


    return (
        <Box sx={{ direction: "rtl", background: LIGHT_BG }}>
            {loading && <div>טוען...</div>}
            <AppBar position="fixed" sx={{ background: LIGHT_BG, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", pt: 1, direction: "rtl", zIndex: 1100 }}>
                <Container>
                    <Toolbar disableGutters sx={{ justifyContent: "space-between", alignItems: "center" }}>

                        {/* לוגו + כיתוב */}
                        <Box display="flex" alignItems="center" gap={2}>
                            <img
                                src={Logo}
                                alt="ClickQuiz logo"
                                style={{ width: 180, cursor: "pointer" }}
                                onClick={() => navigate("/")}
                            />
                            <Typography variant="subtitle1" color="text.secondary">
                                יצירת מבחנים מהירה ומקצועית
                            </Typography>
                        </Box>

                        {/* כפתורי ניווט */}
                        <Box display="flex" alignItems="center" gap={1}>
                            <Button sx={{ color: PRIMARY_COLOR }} onClick={() => navigate("/")}>בית</Button>
                            <Button sx={{ color: PRIMARY_COLOR }} onClick={() => navigate("/create-exam")}>צור מבחן</Button>
                            <Button sx={{ color: PRIMARY_COLOR }} onClick={() => navigate("/get-my-exams")}>המבחנים שלי</Button>
                            <Button sx={{ color: PRIMARY_COLOR }} onClick={() => scrollToElement("about-section")}>אודות</Button>
                            <Button sx={{ color: PRIMARY_COLOR }} onClick={() => scrollToElement("testimonials-section")}>המלצות</Button>
                        </Box>

                        {/* משתמש / הרשמה */}
                        <Box display="flex" alignItems="center" gap={1}>
                            {!isLoggedIn && (
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: SECONDARY_COLOR, color: "white", borderRadius: 2 }}
                                    onClick={() => navigate('/login')}
                                >
                                    הרשמה
                                </Button>
                            )}
                            {isLoggedIn && (
                                <>
                                    <Button
                                        sx={{ color: SECONDARY_COLOR, gap: 1 }}
                                        onClick={handleMenuOpen}
                                        startIcon={
                                            <Avatar sx={{ bgcolor: SECONDARY_COLOR, color: "white", width: 32, height: 32, fontSize: "0.9rem" }}>
                                                {user.name[0]}
                                            </Avatar>
                                        }
                                    >
                                        שלום {user.name}
                                    </Button>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem onClick={() => { handleMenuClose(); setEditDialogOpen(true); }}>
                                            עריכת משתמש
                                        </MenuItem>
                                        <MenuItem onClick={() => { handleMenuClose(); navigate('/login'); }}>
                                            הרשמה חדשה
                                        </MenuItem>
                                        <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>
                                            התנתקות
                                        </MenuItem>
                                    </Menu>
                                </>
                            )}
                        </Box>

                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    );
};

export default NavBar;