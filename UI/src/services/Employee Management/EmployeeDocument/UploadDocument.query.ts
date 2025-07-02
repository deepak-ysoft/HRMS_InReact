// src/api/Document/uploadDocument.ts
import axiosInstance from "../../../../axiosInstance";

export const UploadDocumentQuery = async (
  employeeId: number,
  file: File,
  documentType: string,
  expiryDate?: Date
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("documentType", documentType);
  if (expiryDate) {
    formData.append("expiryDate", expiryDate.toISOString());
  }

  const response = await axiosInstance.post(
    `/api/Document/upload/${employeeId}`,
    formData
  );

  return response.data;
};
