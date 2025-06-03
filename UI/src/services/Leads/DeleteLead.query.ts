import axiosInstance from "../../../axiosInstance";

export const DeleteLeadQuery = async (id: number) => {
  const response = await axiosInstance.delete(`api/Leads/DeleteLeads/${id}`);
  return response.data;
};
