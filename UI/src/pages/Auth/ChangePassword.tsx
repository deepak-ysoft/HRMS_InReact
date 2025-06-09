import { useForm } from "react-hook-form";
import { FormField } from "../../components/FormFieldComponent/FormFieldComponent";
import { Button } from "../../components/ButtonComponent/ButtonComponent";
import { IChangePassword } from "../../types/IChangePassword.type";
import { BreadCrumbsComponent } from "../../components/Breadcrumbs/BreadCrumbsComponents";
import { useMutation } from "@tanstack/react-query";
import { ChangePasswordQuery } from "../../services/Auth/ChangePasswordquery";
import { toast } from "react-toastify";

const userId = localStorage.getItem("UserId") || "";
const defaultValues: IChangePassword = {
  empId: userId,
  currentPassword: "",
  newPassword: "",
  newCPassword: "",
};

export const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IChangePassword>({ defaultValues });

  const { mutate: submitAsset } = useMutation({
    mutationFn: (formData: FormData) => ChangePasswordQuery(formData),
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success(data.message);
        reset(defaultValues);
      } else toast.warning(data.message);
    },
    onError: () => {},
  });

  const onSubmit = (data: IChangePassword) => {
    const userId = localStorage.getItem("UserId") || "";
    const formData = new FormData();
    formData.append("empId", userId);
    formData.append("currentPassword", data.currentPassword);
    formData.append("newPassword", data.newPassword);
    formData.append("newCPassword", data.newCPassword);
    submitAsset(formData);
  };

  return (
    <>
      <BreadCrumbsComponent />
      <div className="w-full  p-3 flex justify-center items-center">
        <h2 className="text-xl font-semibold">Change Password</h2>
      </div>
      <div className="flex justify-center items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className=" bg-base-100 p-12  rounded-lg shadow w-1/3"
        >
          <div className="grid grid-cols-1 gap-x-8">
            <input type="hidden" {...register("empId")} />
            <FormField
              type="password"
              name="currentPassword"
              label="Current Password"
              register={register}
              registerOptions={{ required: "Current password is required" }}
              error={errors.currentPassword}
            />
            <FormField
              type="password"
              name="newPassword"
              label="New Password"
              register={register}
              registerOptions={{ required: "New password is required" }}
              error={errors.newPassword}
            />
            <FormField
              type="password"
              name="newCPassword"
              label="Confirm New Password"
              register={register}
              registerOptions={{
                required: "Please confirm your new password",
                validate: (value, formValues) =>
                  value === formValues?.newPassword || "Passwords do not match",
              }}
              error={errors.newCPassword}
            />
          </div>
          <Button
            type="submit"
            className="bg-[rgb(66,42,213)] text-white mt-2 py-2 px-4 rounded disabled:opacity-50"
            text="Change Password"
          />
        </form>
      </div>
    </>
  );
};
