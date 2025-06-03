import axiosInstance from "../../../axiosInstance";

export const DeleteCalendarEventQuery = async (calId: number) => {
  const response = await axiosInstance.delete(
    `api/Calendar/DeleteCalendar/${calId}`
  );
  return response.data;
};
