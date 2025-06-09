import axiosInstance from "../../../axiosInstance";

export const ChangePasswordQuery = async (formData: FormData) => {
  const response = await axiosInstance.post(
    `api/Account/ChangePassword`,
    formData
  );
  return response.data;
};
