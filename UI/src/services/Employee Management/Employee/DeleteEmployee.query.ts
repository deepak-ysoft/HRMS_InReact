import axiosInstance from "../../../../axiosInstance";

export const deleteEmployee = async (id: number) => {
  try {
    const response = await axiosInstance.delete(
      `api/Employee/DeleteEmployee/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting candidate:", error);
    throw error;
  }
};
