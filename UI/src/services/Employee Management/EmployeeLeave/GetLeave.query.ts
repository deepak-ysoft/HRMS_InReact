import axiosInstance from "../../../../axiosInstance";

export const GetLeave = async (empId: number, page: number) => {
  const response = await axiosInstance.get(
    `api/EmployeesLeave/GetEmployeesLeave?empId=${empId}&page=${page}`
  );
  return response.data;
};
