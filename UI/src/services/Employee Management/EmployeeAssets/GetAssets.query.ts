import axiosInstance from "../../../../axiosInstance";

export const GetAssets = async (empId: number, page: number) => {
  const response = await axiosInstance.get(
    `api/Employee/GetEmployeeAssets?empId=${empId}&page=${page}`
  );
  return response.data;
};
