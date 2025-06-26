import axiosInstance from "../../../../axiosInstance";

export const AttendanceMarkInQuery = async (formData: FormData) => {
  const response = await axiosInstance.post(
    "/api/Attendance/mark-in",
    formData
  );
  return response.data;
};
