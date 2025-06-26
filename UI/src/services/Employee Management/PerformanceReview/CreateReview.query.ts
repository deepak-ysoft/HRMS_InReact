import axiosInstance from "../../../../axiosInstance";

export const CreateReviewQuery = async (formData: FormData) => {
  const response = await axiosInstance.post(
    `/api/PerformanceReview/CreateReview`,
    formData
  );
  return response.data;
};
