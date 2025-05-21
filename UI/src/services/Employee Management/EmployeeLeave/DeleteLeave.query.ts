import axiosInstance from "../../../../axiosInstance";

export const DeleteLeave = async (leaveId: number) => {
  const response = await axiosInstance.delete(
    `api/EmployeesLeave/DeleteEmployeeLeave/${leaveId}`
  );
  return response.data;
};
