import axiosInstance from "../../../axiosInstance"

export const AddEditLeadsQuery = async (data: FormData )=> {
   const response =  await axiosInstance.post(`api/Leads/AddEditLeads`, data)
   return response.data;
}