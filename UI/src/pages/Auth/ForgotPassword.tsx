import { FormField } from "../../components/FormFieldComponent/FormFieldComponent";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ButtonComponent/ButtonComponent";
import { useMutation } from "@tanstack/react-query";
import { ForgotPasswordQuery } from "../../services/Auth/ForgotPasswordquery";
import { toast } from "react-toastify";
import { IForgotPasswordFields } from "../../types/IForgotPasswordFields.type";

const defaultData: IForgotPasswordFields = {
  email: "",
  frontendUrl: "",
};

export const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IForgotPasswordFields>({
    defaultValues: defaultData,
  });

  const onSubmit = (data: IForgotPasswordFields) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("frontendUrl", "http://localhost:5173/");
    // Call your API to send the reset link here
    sendResetLink(formData);
  };

  const { mutate: sendResetLink } = useMutation({
    mutationFn: (formData: FormData) => ForgotPasswordQuery(formData),
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
      <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <input
            type="hidden"
            value="http://localhost:5173/"
            {...register("frontendUrl")}
          />
          <FormField
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email"
            register={register}
            registerOptions={{ required: "Email is required" }}
            error={errors.email}
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          text={isSubmitting ? "Sending..." : "Send Reset Link"}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
        />
      </form>
    </div>
  );
};
