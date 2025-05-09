import axiosInstance from "../../../axiosInstance";
export const getCandidateApi = async ({
  page = 1,
  pageSize = 10,
  sortColumn = "name",
  sortDirection = "asc",
  searchField = "name",
  searchValue = "",
}) => {
  const response = await axiosInstance.get(
    `api/Candidate/GetCandidates?page=${page}&pageSize=${pageSize}&sortColumn=${sortColumn}&sortDirection=${sortDirection}&SearchField=${searchField}&SearchValue=${searchValue}`
  );
  return response.data;
};
