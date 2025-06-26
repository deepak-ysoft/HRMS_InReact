import axiosInstance from "../../../../axiosInstance";

export const GetPayrollSlipQuery = async (
  employeeId: number,
  month: number,
  year: number
) => {
  const response = await axiosInstance.get(
    `/api/Payroll/slip/${employeeId}/${month}/${year}`
  );
  return response.data;
};
