import axiosInstance from "../../../../axiosInstance";

export const GeneratePayrollQuery = async (formData: FormData) => {
  const response = await axiosInstance.post(`/api/Payroll/generate`, formData);
  return response.data;
};
