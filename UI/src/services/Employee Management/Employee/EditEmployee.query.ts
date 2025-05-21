import axiosInstance from "../../../../axiosInstance";

export const EditEmployeeasync = async (data: FormData) => {
  const response = await axiosInstance.post("api/Employee/UpdateEmployee", data);
  return response.data;
};
