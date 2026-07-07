// src/services/authService.js
import { request } from "./apiClient";

export const login = async (data) => {
    return request({
        method: "post",
        url: "/auth/login",
        data,
    });
};

export const register = async (data) => {
    return request({
        method: "post",
        url: "/auth/register",
        data,
    });
};

export const logout = async () => {
    return request({
        method: "post",
        url: "/auth/logout",
        data: {},
    });
};

export const me = async () => {
    return request({
        method: "get",
        url: "/auth/me",
    });
};

export const sendPasswordReset = async (email) => {
    return request({
        method: "post",
        url: "/auth/forgot-password",
        data: { email },
    });
};

export const resetPassword = async (token, newPassword) => {
    return request({
        method: "post",
        url: `/auth/reset-password/${token}`,
        data: { password: newPassword },
    });
};

export const loginWithGoogle = async (googleUser) => {
    return request({
        method: "post",
        url: "/auth/google-login",
        data: googleUser,
    });
};

export default request;
