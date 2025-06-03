import axiosInstance from "../../../axiosInstance";

export const UpdateCalendarEventQuery = async (calendarEvent: FormData) => {
  const response = await axiosInstance.post(
    `api/Calendar/UpdateCalendar`,
    calendarEvent
  );
  return response.data;
};
