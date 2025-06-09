import axiosInstance from "../../../axiosInstance";

export const ForgotPasswordQuery = async (formData: FormData) => {
  const response = await axiosInstance.post(
    `api/Account/forgot-password`,
    formData
  );
  return response.data;
};
