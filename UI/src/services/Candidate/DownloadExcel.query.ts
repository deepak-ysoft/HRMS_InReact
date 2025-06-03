import axiosInstance from "../../../axiosInstance";

export const DownloadExcel = async () => {
  const response = await axiosInstance.get(`api/Candidate/DownloadExcel`);
  return response.data;
};
