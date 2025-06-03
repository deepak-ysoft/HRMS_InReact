import axiosInstance from "../../../axiosInstance";

export const AddLeadsFromExcelQuery = async (file: FormData) => {
  const response = await axiosInstance.post(`api/Leads/AddLeadsFromExcel`, file);
  return response.data;
};
