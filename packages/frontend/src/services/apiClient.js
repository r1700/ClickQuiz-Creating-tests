import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const request = async ({ method = "get", url, data, params, timeout, ...options }) => {
  try {
    const response = await api.request({
      method,
      url,
      data,
      params,
      timeout,
      ...options,
    });

    return {
      data: response.data,
      status: response.status,
      isError: false,
      message: null,
    };
  } catch (error) {
    return {
      data: null,
      status: error.response?.status || 500,
      isError: true,
      message:
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message,
    };
  }
};

export default api;
