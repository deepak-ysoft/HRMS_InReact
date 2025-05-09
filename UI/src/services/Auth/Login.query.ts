import axiosInstance from "../../../axiosInstance";
export const loginApi = async (data: any) => {
  const response = await axiosInstance.post("api/Account/Login", data);
  return response.data;
};
