import axiosInstance from "../../../../axiosInstance";

export const GetReviewsQuery = async (employeeId: number) => {
  const response = await axiosInstance.get(
    `/api/PerformanceReview/GetReviews/${employeeId}`
  );
  return response.data;
};
