import { request } from "./apiClient";

export const updateQuestionService = async (examId, question) => {
  return request({
    method: "put",
    url: `/exams/${examId}/questions/${question._id}`,
    data: question,
  });
};

export const addQuestionService = async (examId, newQuestion) => {
  return request({
    method: "post",
    url: `/exams/${examId}/questions`,
    data: newQuestion,
  });
};

export const deleteQuestionService = async (examId, questionId) => {
  return request({
    method: "delete",
    url: `/exams/${examId}/questions/${questionId}`,
  });
};
 