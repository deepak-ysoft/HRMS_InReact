import axiosInstance from "../../../../axiosInstance";

export const getDocumentsQuery = async (employeeId: number) => {
  const response = await axiosInstance.get(
    `/api/Document/GetDocuments/${employeeId}`
  );
  return response.data;
};
