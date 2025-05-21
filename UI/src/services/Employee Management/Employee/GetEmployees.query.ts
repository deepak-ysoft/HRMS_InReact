import axiosInstance from "../../../../axiosInstance";

export const getEmployees = async ({
  page = 1,
  pageSize = 10,
  searchValue = "",
}) => {
  // Build query params
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    SearchValue: searchValue,
  });
  const response = await axiosInstance.get(
    `api/Employee/GetEmployees?${params.toString()}`
  );
  return response.data;
};
