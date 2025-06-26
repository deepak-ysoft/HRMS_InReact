import axiosInstance from "../../../../axiosInstance";

export const AttendanceMarkOutQuery = async (formData: FormData) => {
  const response = await axiosInstance.post("/api/Attendance/mark-out", formData);
  return response.data;
};
