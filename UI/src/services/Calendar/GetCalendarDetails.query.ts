import axiosInstance from "../../../axiosInstance";

export const GetCalendarByIdQuery = async (calId: number) => {
  const response = await axiosInstance.get(
    `api/Calendar/GetCalendarDetails/${calId}`
  );
  return response.data;
};
