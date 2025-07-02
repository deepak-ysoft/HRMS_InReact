import axiosInstance from "../../../../axiosInstance";

export const GetPayrollSlipQuery = async (
  empId = 0,
  page = 1,
  pageSize = 10,
  searchValue = ""
) => {
  const params = new URLSearchParams({
    empId: empId.toString(),
    page: page.toString(),
    pageSize: pageSize.toString(),
    searchValue: searchValue,
  });
  const response = await axiosInstance.get(
    `/api/Payroll/Get-payslip?${params.toString()}`
  );
  return response.data;
};
