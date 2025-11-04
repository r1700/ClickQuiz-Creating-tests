// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { me ,logout} from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // const isLoggedIn = !!user;

  useEffect(() => {
    me().then(u => setUser(u)).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  const LogOut = async () => {
    try {
      await logout(); // שולח בקשה לשרת למחיקת ה-cookie
      setUser(null);     // מאפס את המשתמש
      // isLoggedIn = false;
    } catch (err) {
      console.error("LogOut failed:", err);
    }
  };

  return <AuthContext.Provider value={{ user, setUser, loading, isLoggedIn: !!user, LogOut }}>{children}</AuthContext.Provider>;
};
