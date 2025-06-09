import { useForm } from "react-hook-form";
import { IResetPassword } from "../../types/IResetPassword.type";
import { useMutation } from "@tanstack/react-query";
import { ResetPasswordQuery } from "../../services/Auth/ResetPasswordquery";
import { toast } from "react-toastify";
import { FormField } from "../../components/FormFieldComponent/FormFieldComponent";
import { Button } from "../../components/ButtonComponent/ButtonComponent";
import { useSearchParams } from "react-router-dom";

const defaultData: IResetPassword = {
  token: "",
  newPassword: "",
  confirmPassword: "",
};

export const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IResetPassword>({
    defaultValues: defaultData,
  });

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = (data: IResetPassword) => {
    const formData = new FormData();
    formData.append("token", token!);
    formData.append("newPassword", data?.newPassword);
    formData.append("confirmPassword", data?.confirmPassword);
    // Call your API to send the reset link here
    sendResetLink(formData);
  };

  const { mutate: sendResetLink } = useMutation({
    mutationFn: (formData: FormData) => ResetPasswordQuery(formData),
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success(data.message);
      } else {
        toast.warning(data.message);
      }
    },
  });

  return (
    <div className="w-full max-w-md p-6 bg-base-100 rounded-lg shadow space-y-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <input type="hidden" {...register("token")} />
          <FormField
            type="password"
            name="newPassword"
            register={register}
            isRequired
            registerOptions={{ required: "Password is required." }}
            label="Password"
            placeholder="Enter Password"
            error={errors.newPassword}
          />
          <FormField
            type="password"
            name="confirmPassword"
            register={register}
            isRequired
            registerOptions={{ required: "Confirm password is required." }}
            label="Password"
            placeholder="Enter confirm password"
            error={errors.confirmPassword}
          />
        </div>
        <Button
          text={isSubmitting ? "Submitting" : "Submit"}
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
        />
      </form>
    </div>
  );
};
