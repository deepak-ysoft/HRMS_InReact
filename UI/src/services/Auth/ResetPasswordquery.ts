import axiosInstance from "../../../axiosInstance";

export const ResetPasswordQuery = async (formData: FormData) => {
  const response = await axiosInstance.post(
    `api/Account/reset-password`,
    formData
  );
  return response.data;
};
