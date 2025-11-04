// src/services/authService.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001/api",
    withCredentials: true
});
export const login = async (data) => {
    try {
        const res = await axios.post(`${API_URL}/auth/login`, data, {
            withCredentials: true, // חשוב לשלוח cookies לשרת
        });
        return res.data;
    } catch (error) {
        console.error("❌ שגיאה בהתחברות:", error);
        throw error;
    }
};
export const register = async (data) => {
    try {
        const res = await axios.post(`${API_URL}/auth/register`, data);
        return res.data;
    } catch (error) {
        console.error("❌ שגיאה בהרשמה:", error);
        throw error;
    }
};
export const logout = async () => {
    try {
        const res = await axios.post(`${API_URL}/auth/logout`,{}, {
      withCredentials: true,
    });
        return res.data;
    } catch (error) {
        console.error("❌ שגיאה ביציאה:", error);
        throw error;
    }
};

export const me = async () => {
  try {
    const res = await axios.get(`${API_URL}/auth/me`, {
      withCredentials: true, // חשוב לשלוח cookies לשרת
    });
    return res.data;
  } catch (error) {
    console.error("❌ שגיאה בקבלת פרטי המשתמש:", error);
    throw error;
  }
};


export const sendPasswordReset = async (email) => {
    try {
        const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
        return res.data;
    } catch (error) {
        console.error("❌ שגיאה בשליחת בקשת איפוס:", error);
        throw error;
    }
};


export const resetPassword = async (token, newPassword) => {
    try {
        const res = await axios.post(`${API_URL}/auth/reset-password/${token}`, {
            password: newPassword,
        });
        return res.data;
    } catch (error) {
        console.error("❌ שגיאה באיפוס הסיסמה:", error);
        throw error;
    }
};


export const loginWithGoogle = async (googleUser) => {
    try {
        // לדוגמה: { email, name, picture, sub (googleId) }
        const res = await axios.post(`${API_URL}/auth/google-login`, googleUser,{
            withCredentials: true, // חשוב לשלוח cookies לשרת
        });
        return res.data;
    } catch (error) {
        console.error("❌ שגיאה בהתחברות עם Google:", error);
        throw error;
    }
};
export default api;
