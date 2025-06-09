import axiosInstance from "../../../../axiosInstance";

export const EmployeeDetailsQuery = async (empId: number) => {
  const response = await axiosInstance.get(
    `api/Employee/GetEmployeeById/${empId}`
  );
  return response.data;
};
