import axiosInstance from "../../../axiosInstance";
export const getCandidateApi = async ({
  page = 1,
  pageSize = 10,
  searchValue = "",
  filters = {},
}) => {
  // Build query params
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    SearchValue: searchValue,
    ...Object.fromEntries(
      Object.entries(filters || {}).map(([k, v]) => [k, v])
    ),
  });
  const response = await axiosInstance.get(
    `api/Candidate/GetCandidates?${params.toString()}`
  );
  return response.data;
};
