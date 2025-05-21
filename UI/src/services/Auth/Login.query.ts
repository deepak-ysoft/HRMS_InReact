import axiosInstance from "../../../axiosInstance";
import { LoginFormFields } from "../../types/ILogin";
export const loginApi = async (data: LoginFormFields) => {
  const response = await axiosInstance.post("api/Account/Login", data);
  return response.data;
};
