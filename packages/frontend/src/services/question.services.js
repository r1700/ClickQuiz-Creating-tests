import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api"; // כתובת השרת


export const updateQuestionService = async (examId, question) => {
    try {
        const res = await axios.put( `${BASE_URL}/exams/${examId}/questions/${question._id}`, question);
        return res;
    }
    catch (error) {
        return error.res.status;
    }
}

export const addQuestionService = async (examId, newQuestion) => {
    try {
        const res = await axios.post(
        `${BASE_URL}/exams/${examId}/questions`,
        newQuestion
      );
        return res;
    }
    catch (error) {
        return error.res.status;
    }
}

export const deleteQuestionService = async (examId, questionId) => {
    try {
       const res = await axios.delete(
          `${BASE_URL}/exams/${examId}/questions/${questionId}`
        );
        return res;
    }
    catch (error) {
        return error.res.status;
    }
}
 