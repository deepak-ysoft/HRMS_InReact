import axiosInstance from "../../../axiosInstance";

export const AddCandidateWithExcel = async (formData: FormData) => {
  const response = await axiosInstance.post(
    `api/Candidate/AddCandidatesFromExcel`,
    formData
  );
  return response.data;
};
