// components/NavBar
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/quiz.png";
import {
    AppBar, Avatar, Box, Button, Container, Divider, Drawer, IconButton,
    List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, Toolbar, Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../context/AuthContext';
import Cookies from "js-cookie";

// צבעים
const PRIMARY_COLOR = "#002275";
const SECONDARY_COLOR = "#14B0FF";
const LIGHT_BG = "#F6F9FB";

const NavBar = () => {
    const { user, isLoggedIn, loading, LogOut } = useContext(AuthContext);
    const navigate = useNavigate();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

    const scrollToElement = (id) => {
        setMobileOpen(false);
        if (window.location.pathname !== "/") {
            navigate("/");
            setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
            }, 300);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }
    };

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

    const navItems = [
        { label: "בית", action: () => { setMobileOpen(false); navigate("/"); } },
        { label: "צור מבחן", action: () => { setMobileOpen(false); navigate("/create-exam"); } },
        { label: "המבחנים שלי", action: () => { setMobileOpen(false); navigate("/get-my-exams"); } },
        { label: "אודות", action: () => scrollToElement("about-section") },
        { label: "המלצות", action: () => scrollToElement("testimonials-section") },
    ];

    //  Mobile Menu Drawer
    const drawer = (
        <Box sx={{ direction: "rtl", width: 250 }} role="presentation">
            <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <img src={Logo} alt="ClickQuiz" style={{ width: 160 }} />
            </Box>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton onClick={item.action}>
                            <ListItemText primary={item.label} sx={{ textAlign: "right" }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <Box sx={{ p: 2 }}>
                {!isLoggedIn ? (
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ backgroundColor: SECONDARY_COLOR }}
                        onClick={() => { setMobileOpen(false); navigate('/login'); }}
                    >
                        הרשמה / התחברות
                    </Button>
                ) : (
                    <Box>
                        <Typography sx={{ mb: 1, color: SECONDARY_COLOR, fontWeight: 600 }}>
                            שלום {user.name}
                        </Typography>
                        <Button fullWidth onClick={() => { setMobileOpen(false); handleLogout(); }}>
                            התנתקות
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );

    return (
        <Box sx={{ direction: "rtl", background: LIGHT_BG }}>
            {loading && <div>טוען...</div>}
            <AppBar position="fixed" sx={{ background: LIGHT_BG, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", pt: 0.5, direction: "rtl", zIndex: 1200 }}>
                <Container>
                    <Toolbar disableGutters sx={{ justifyContent: "space-between", alignItems: "center" }}>

                        {/* Logo */}
                        <img
                            src={Logo}
                            alt="ClickQuiz logo"
                            style={{ width: 150, cursor: "pointer" }}
                            onClick={() => navigate("/")}
                        />

                        {/* Navigation Items - Desktop Only */}
                        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
                            {navItems.map((item) => (
                                <Button key={item.label} sx={{ color: PRIMARY_COLOR }} onClick={item.action}>
                                    {item.label}
                                </Button>
                            ))}
                        </Box>

                        {/* User Menu - Desktop Only */}
                        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
                            {!isLoggedIn ? (
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: SECONDARY_COLOR, color: "white", borderRadius: 2 }}
                                    onClick={() => navigate('/login')}
                                >
                                    הרשמה
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        sx={{ color: SECONDARY_COLOR, gap: 1 }}
                                        onClick={handleMenuOpen}
                                        endIcon={
                                            <Avatar sx={{ bgcolor: SECONDARY_COLOR, color: "white", width: 32, height: 32, fontSize: "0.9rem" }}>
                                                {user.name[0]}
                                            </Avatar>
                                        }
                                    >
                                        שלום {user.name}
                                    </Button>
                                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
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

                        {/* Mobile Menu Button */}
                        <IconButton
                            sx={{ display: { xs: "flex", md: "none" }, color: PRIMARY_COLOR }}
                            onClick={handleDrawerToggle}
                        >
                            <MenuIcon />
                        </IconButton>

                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile Menu Drawer */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

export default NavBar;