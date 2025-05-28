import axiosInstance from "../../../../axiosInstance";

export const DeleteAssets = async (assetId: number) => {
  const response = await axiosInstance.delete(
    `api/Employee/DeleteEmployeeAssets/${assetId}`
  );
  return response.data;
};
