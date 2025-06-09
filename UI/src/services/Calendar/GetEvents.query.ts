import axiosInstance from "../../../axiosInstance";

export const getEvents = async () => {
  const response = await axiosInstance.get(`api/Calendar/GetEventList`);
  return response.data;
};
