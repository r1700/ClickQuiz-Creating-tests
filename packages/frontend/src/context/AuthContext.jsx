// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { me } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    me().then(u => setUser(u)).catch(()=>setUser(null)).finally(()=>setLoading(false));
  }, []);

  return <AuthContext.Provider value={{ user, setUser, loading }}>{children}</AuthContext.Provider>;
};
