import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ILeads } from "../../types/ILeads.type";
import { AddEditLeadsQuery } from "../../services/Leads/AddEditLeads.query";
import { BreadCrumbsComponent } from "../../components/Breadcrumbs/BreadCrumbsComponents";
import { FormField } from "../../components/FormFieldComponent/FormFieldComponent";
import { Button } from "../../components/ButtonComponent/ButtonComponent";
import { validateLeadsForm } from "../../formValidation/validateLeadsForm";

const defaultValues: Partial<ILeads> = {
  leadsId: 0,
  dateTime: "",
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
    setError,
    formState: { errors, isSubmitting },
    watch,
    register,
  } = useForm<ILeads>({ defaultValues });

  useEffect(() => {
    if (editData) {
      Object.entries(editData).forEach(([key, value]) => {
        setValue(key as string, value as never);
      });
    }
  }, [editData, setValue]);

  const { mutate: SubmitLead } = useMutation({
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
    const validationErrors = validateLeadsForm(data);
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([key, message]) => {
        setError(key as string, {
          type: "manual",
          message: message as string,
        });
      });
      return;
    }
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "leadsId") {
          formData.append(key, data.leadsId ? String(data.leadsId) : "0");
        } else {
          formData.append(key, String(value));
        }
      }
    });
    SubmitLead(formData);
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
          <FormField
            type="datetime-local"
            name="dateTime"
            label="Date & Time"
            register={register}
            registerOptions={{ required: "Date & Time is required" }}
            error={errors.dateTime}
          />
          <FormField
            type="text"
            name="linkedInProfile"
            label="LinkedIn Profile"
            placeholder="Enter LinkedIn Profile"
            register={register}
            registerOptions={{ required: "LinkedIn Profile is required" }}
            error={errors.linkedInProfile}
          />
          <FormField
            type="text"
            name="post"
            label="Post"
            placeholder="Enter Post"
            register={register}
            registerOptions={{ required: "Post is required" }}
            error={errors.post}
          />
          <FormField
            type="text"
            name="email"
            label="Email"
            placeholder="Enter Email"
            register={register}
            registerOptions={{ required: "Email is required" }}
            error={errors.email}
          />
          <FormField
            type="text"
            name="number"
            label="Mobile No"
            placeholder="Enter Mobile No"
            register={register}
            registerOptions={{ required: "Mobile No is required" }}
            error={errors.number}
          />
          <FormField
            type="textarea"
            name="remarks"
            label="Remarks"
            placeholder="Enter Remarks"
            register={register}
            registerOptions={{ required: "Remarks are required" }}
            error={errors.remarks}
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
