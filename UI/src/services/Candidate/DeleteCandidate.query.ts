import axiosInstance from "../../../axiosInstance";

export const deleteCandidate = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`api/Candidate/DeleteCandidate/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting candidate:", error);
    throw error;
  }
};
