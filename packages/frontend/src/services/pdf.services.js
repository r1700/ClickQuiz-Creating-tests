// packages/frontend/src/services/pdf.services.js
import { request } from "./apiClient";

export const uploadPdf = async (file) => {
    return request({
        method: "post",
        url: "/pdf/upload-pdf",
        data: file,
    });
};


