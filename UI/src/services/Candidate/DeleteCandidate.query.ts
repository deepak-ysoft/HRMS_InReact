import axiosInstance from "../../../axiosInstance";

export const deleteCandidate = async (id: string) => {
  const response = await axiosInstance.delete(
    `api/Candidate/DeleteCandidate/${id}`
  );
  return response.data;
};
