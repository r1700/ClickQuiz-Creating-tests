// packages/frontend/src/services/Exam.services.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api"; // כתובת השרת

export const createExamAIService = async (payload) => {
    try {
        const res = await axios.post(`${BASE_URL}/exams/create-ai`, payload, {
            timeout: 120000,
            withCredentials: true,
        });
        return res;
    }
    catch (error) {
        return error.res.status;
    }
}

export const createExamManualService = async (payload) => {
    try {
        const res = await axios.post(`${BASE_URL}/exams/create`, payload, { 
            withCredentials: true
         });
        return res;
    }
    catch (error) {
        return error.res.status;
    }
}

// שליפת מבחן לפי ID
export const getExamService = async (id) => {
    try {
        const res = await axios.get(`${BASE_URL}/exams/get-exams/${id}`,{ 
            withCredentials: true
         })
        return res;
    }
    catch (error) {
        return error.res.status;
    }
}

// 🆕 עדכון מבחן קיים
export const updateExamService = (examId, updatedData) => {
  return axios.put(`${BASE_URL}/exams/update/${examId}`, updatedData, {
    withCredentials: true
  });
};

// שליפת כל המבחנים של המשתמש הנוכחי
export const getExamsServiceByUser = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/exams/get-my-exams`, {
      withCredentials: true
    });
    // console.log(res.data);
    
    return res;
  } catch (error) {
    return error.response?.status;
  }
};

// מחיקת מבחן לפי ID
export const deleteExamService = async (examId) => {
  try {
    const res = await axios.delete(`${BASE_URL}/exams/delete/${examId}`, {
      withCredentials: true
    });
    // console.log(res.data);  
    return res;
  } catch (error) {
    console.log("🚨 Error deleting exam:", error);
    
    return error.response?.status;
  }
};