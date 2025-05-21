import axiosInstance from "../../../../axiosInstance";

export const AddEditLeave = async (data: FormData) => {
  const response = await axiosInstance.post(
    `api/EmployeesLeave/AddUpdateEmployeeLeave`,
    data
  );
  return response.data;
};
