import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ILeads } from "../../types/ILeads.type";
import { AddEditLeadsQuery } from "../../services/Leads/AddEditLeads.query";
import { BreadCrumbsComponent } from "../../components/Breadcrumbs/BreadCrumbsComponents";
import CustomInput from "../../components/FormFieldComponent/InputComponent";
import { Button } from "../../components/ButtonComponent/ButtonComponent";

const defaultValues: Partial<ILeads> = {
  leadsId: 0,
  dateTime: "", // ISO 8601 date string
  linkedInProfile: "",
  post: "",
  email: "",
  number: "",
  remarks: "",
};

export const LeadForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state as Partial<ILeads> | undefined;
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ILeads>({ defaultValues });

  useEffect(() => {
    if (editData) {
      Object.entries(editData).forEach(([key, value]) => {
        setValue(key as string, value as never);
      });
    }
  }, [editData, setValue]);

  const { mutate: SubmitLeave } = useMutation({
    mutationFn: (formData: FormData) => AddEditLeadsQuery(formData),
    onSuccess: (data) => {
      if (data.isSuccess) toast.success(data.message);
      else toast.warning(data.message);
      reset(defaultValues);
      navigate("/Leads");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const onSubmit = (data: ILeads) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null || value !== undefined) {
        if (key === "leadsId") {
          formData.append(key, data.leadsId ? String(data.leadsId) : "0");
        } else {
          formData.append(key, String(value));
        }
      }
    });
    SubmitLeave(formData);
  };
  return (
    <>
      <BreadCrumbsComponent />
      <div className="w-full max-w-2xl p-3">
        <h2 className="text-xl font-semibold">
          {editData ? "Edit" : "Add"} Lead
        </h2>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="bg-base-100 p-8 rounded-lg shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8">
          <input name="leadsId" type="hidden" value={watch("leadsId") || 0} />
          <CustomInput
            label="Date & Time"
            name="dateTime"
            type="datetime-local"
            value={watch("dateTime") || ""}
            onChange={(e) => setValue("dateTime", e.target.value)}
            error={errors.dateTime?.message?.toString()}
            required
          />
          <CustomInput
            label="LinkedIn Profile"
            name="linkedInProfile"
            type="text"
            value={watch("linkedInProfile") || ""}
            onChange={(e) => setValue("linkedInProfile", e.target.value)}
            error={errors.linkedInProfile?.message?.toString()}
            required
          />
          <CustomInput
            label="Post"
            name="post"
            type="text"
            value={watch("post") || ""}
            onChange={(e) => setValue("post", e.target.value)}
            error={errors.post?.message?.toString()}
            required
          />

          <CustomInput
            label="Email"
            name="email"
            type="text"
            value={watch("email") || ""}
            onChange={(e) => setValue("email", e.target.value)}
            error={errors.email?.message?.toString()}
            required
          />
          <CustomInput
            label="Mobile No"
            name="number"
            type="text"
            value={watch("number") || ""}
            onChange={(e) => setValue("number", e.target.value)}
            error={errors.number?.message?.toString()}
            required
          />
          <CustomInput
            label="Remarks"
            name="remarks"
            type="textarea"
            value={watch("remarks") || ""}
            onChange={(e) => setValue("remarks", e.target.value)}
            error={errors.remarks?.message?.toString()}
            required
          />
        </div>
        <Button
          type="submit"
          text={isSubmitting ? "Submitting..." : "Submit"}
          className="bg-blue-500 text-white mt-10 py-2 px-4 rounded disabled:opacity-50"
          disabled={isSubmitting}
        />
        <Button
          type="button"
          text="Reset"
          onClick={() => reset(defaultValues)}
          className="bg-gray-500 text-white mt-10 py-2 px-4 rounded ml-4"
        />
      </form>
    </>
  );
};
