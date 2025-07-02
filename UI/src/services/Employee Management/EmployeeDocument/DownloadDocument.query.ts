import axiosInstance from "../../../../axiosInstance";

export const DownloadDocumentQuery = async (
  documentId: number,
  fileName: string
) => {
  try {
    const response = await axiosInstance.get(
      `/api/Document/download/${documentId}`,
      {
        responseType: "blob", // Important: we expect binary data, not JSON
      }
    );

    // Create a blob and temporary download link
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Clean up the blob URL
    window.URL.revokeObjectURL(url);
  } catch (error) {
    alert(error);
  }
};
