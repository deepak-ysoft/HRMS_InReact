import axiosInstance from "../../../../axiosInstance";

export const AddEmployeeasync = async (data: FormData) => {
  const response = await axiosInstance.post("api/Employee/AddEmployee", data);
  return response.data;
};
