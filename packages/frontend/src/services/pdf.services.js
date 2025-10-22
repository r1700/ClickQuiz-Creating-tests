// packages/frontend/src/services/pdf.services.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api"; // כתובת השרת

export const uploadPdf = async (file) => {

    const response = await axios.post(`${BASE_URL}/pdf/upload-pdf`, file);
    return response.data;
};


