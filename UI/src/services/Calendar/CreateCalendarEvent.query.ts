import axiosInstance from "../../../axiosInstance";

export const CreateCalendarEventQuery = async (calendarEvent: FormData) => {
  const response = await axiosInstance.post(
    `api/Calendar/CreateCalendar`,
    calendarEvent
  );
  return response.data;
};
