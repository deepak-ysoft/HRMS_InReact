import axiosInstance from "../../../axiosInstance";

export const InterviewData = async () => {
  const response = await axiosInstance.get(`api/Candidate/getWeekAndTodayData`);
  return response.data;
};
