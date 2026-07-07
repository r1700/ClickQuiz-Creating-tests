// packages/frontend/src/services/Exam.services.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api"; // כתובת השרת

// create exam using AI
export const createExamAIService = async (payload) => {
    try {
        const res = await axios.post(`${BASE_URL}/exams/create-ai`, payload, {
            timeout: 120000,
            withCredentials: true,
        });
        return {
            status: res.status,
            data: res.data,
            isError: false,
        };
    } catch (error) {
        return {
            status: error.response?.status || 500,
            data: error.response?.data,
            message: error.response?.data?.error || error.response?.data?.message || error.message,
            isError: true,
        };
    }
}

// create exam manually
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

// get exam by ID
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

// eddit existing exam
export const updateExamService = (examId, updatedData) => {
  return axios.put(`${BASE_URL}/exams/update/${examId}`, updatedData, {
    withCredentials: true
  });
};

// get all exams for the logged-in user
export const getExamsServiceByUser = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/exams/get-my-exams`, {
      withCredentials: true
    });
    
    return res;
  } catch (error) {
    return error.response?.status;
  }
};

// delete exam by ID
export const deleteExamService = async (examId) => {
  try {
    const res = await axios.delete(`${BASE_URL}/exams/delete/${examId}`, {
      withCredentials: true
    });
    return res;
  } catch (error) {
    return error.response?.status;
  }
};