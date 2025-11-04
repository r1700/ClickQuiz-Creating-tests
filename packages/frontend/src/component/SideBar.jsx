// components/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from "../assets/ql.png";

const Sidebar = () => {
    const sidebarStyle = {
        // display: 'flex',
        // flexDirection: 'column',
        // alignItems: 'flex-start',


        width: '220px',
        backgroundColor: '#001139',
        color: 'white',
        // height: '100vh',
        padding: '20px',
        boxSizing: 'border-box',
        direction: 'rtl'
    };

    const linkStyle = {
        display: 'block',
        color: 'white',
        textDecoration: 'none',
        marginBottom: '15px',
    };

    const activeLinkStyle = {
        fontWeight: 'bold',
        color: '#3498db',
    };
     const logoStyle = {
    width: '100%',
    direction:'rtl'
    // height: '120px',
    // marginBottom: '30px',
    // backgroundColor: '#001139', // רקע כחול כהה
    // borderRadius: '10px', // אופציונלי – פינות מעוגלות
    // objectFit: 'contain',
    // padding: '10px',
  };

    return (
        <div style={sidebarStyle}>
              <img src={Logo} alt="ClickQuiz Logo" style={logoStyle} />
            {/* <h2 style={{ marginBottom: '30px' }}>ClickQuiz</h2> */}
            <nav>
                <NavLink to="/" end style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}>
                    דף הבית
                </NavLink>
                <NavLink to="/create-exam" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}>
                    צור מבחן חדש
                </NavLink>
                <NavLink to="/get-my-exams" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}>
                    המבחנים שלי
                </NavLink>
                <NavLink to="/profile" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}>
                    הפרופיל שלי
                </NavLink>
                <NavLink to="/login" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}>
                    כניסה / הרשמה
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;
