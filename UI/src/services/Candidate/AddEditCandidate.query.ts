import axiosInstance from "../../../axiosInstance";

export const addEditCandidateApi = async (data: FormData) => {
  const response = await axiosInstance.post(
    "api/Candidate/AddEditCandidate",
    data
  );
  return response.data;
};
