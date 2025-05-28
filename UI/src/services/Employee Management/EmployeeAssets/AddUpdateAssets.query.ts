import axiosInstance from "../../../../axiosInstance";

export const AddEditAssets = async (data: FormData) => {
  const response = await axiosInstance.post(`api/Employee/AddUpdateEmployeeAssets`, data);
  return response.data;
};
