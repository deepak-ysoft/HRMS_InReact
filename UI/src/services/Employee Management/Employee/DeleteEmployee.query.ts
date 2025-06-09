import axiosInstance from "../../../../axiosInstance";

export const deleteEmployee = async (id: number) => {
  const response = await axiosInstance.delete(
    `api/Employee/DeleteEmployee/${id}`
  );
  return response.data;
};
