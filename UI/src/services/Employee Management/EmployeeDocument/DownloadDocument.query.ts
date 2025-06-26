import axiosInstance from "../../../../axiosInstance";

export const DownloadDocumentQuery = async (documentId: string) => {
  const response = await axiosInstance.get(
    `/api/Document/download/${documentId}`
  );
  return response.data;
};
