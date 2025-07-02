import axiosInstance from "../../../../axiosInstance";

export const GetAttendanceQuery = async (
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
    `/api/Attendance/Get-attendance?${params.toString()}`
  );
  return response.data;
};
