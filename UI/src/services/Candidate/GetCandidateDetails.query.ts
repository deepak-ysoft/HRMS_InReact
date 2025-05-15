import axiosInstance from "../../../axiosInstance";

export const getCandidateDetails = async (id: string) => {
  const response = await axiosInstance.get(`api/Candidate/GetCandidate/${id}`);
  return response.data;
};