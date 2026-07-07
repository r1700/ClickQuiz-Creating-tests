// packages/frontend/src/services/Exam.services.js
import { request } from "./apiClient";

export const createExamAIService = async (payload) => {
  return request({
    method: "post",
    url: "/exams/create-ai",
    data: payload,
    timeout: 120000,
  });
};

export const createExamManualService = async (payload) => {
  return request({
    method: "post",
    url: "/exams/create",
    data: payload,
  });
};

export const getExamService = async (id) => {
  return request({
    method: "get",
    url: `/exams/get-exams/${id}`,
  });
};

export const updateExamService = async (examId, updatedData) => {
  return request({
    method: "put",
    url: `/exams/update/${examId}`,
    data: updatedData,
  });
};

export const getExamsServiceByUser = async () => {
  return request({
    method: "get",
    url: "/exams/get-my-exams",
  });
};

export const deleteExamService = async (examId) => {
  return request({
    method: "delete",
    url: `/exams/delete/${examId}`,
  });
};