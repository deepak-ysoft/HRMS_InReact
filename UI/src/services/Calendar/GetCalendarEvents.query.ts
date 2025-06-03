import axiosInstance from "../../../axiosInstance";

export const GetCalendarQuery = async () => {
  const response = await axiosInstance.get(`api/Calendar/GetCalendar`);
  return response.data;
};
