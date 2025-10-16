import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api"; // כתובת השרת

export const createExamAIService = async (payload) => {
    try {
        const res = await axios.post("/exams/create-ai", payload, {
            baseURL: BASE_URL,
            timeout: 120000,
        });
        return res;
    }
    catch (error) {
        return error.res.status;
    }
}

export const createExamManualService = async (payload) => {
    try {
        const res = await axios.post(`${BASE_URL}/exams/create`, payload);
        return res;
    }
    catch (error) {
        return error.res.status;
    }
}

export const getExamService = async (id) => {
    try {
        const res = await axios.get(`${BASE_URL}/exams/get-exams/${id}`)
        return res;
    }
    catch (error) {
        return error.res.status;
    }
}

// 🆕 עדכון מבחן קיים
export const updateExamService = (examId, updatedData) => {
  return axios.put(`${BASE_URL}/exams/update/${examId}`, updatedData);
};