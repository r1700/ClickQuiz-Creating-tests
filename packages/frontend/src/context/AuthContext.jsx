// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { me ,logout} from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // const isLoggedIn = !!user;

  useEffect(() => {
    me()
      .then((res) => setUser(res.isError ? null : res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const LogOut = async () => {
    try {
      const res = await logout();
      if (!res.isError) {
        setUser(null);
      }
    } catch (err) {
      console.error("LogOut failed:", err);
    }
  };

  return <AuthContext.Provider value={{ user, setUser, loading, isLoggedIn: !!user, LogOut }}>{children}</AuthContext.Provider>;
};
