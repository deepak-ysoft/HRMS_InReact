import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Candidate } from "../../../types/ICandidate";
import { Button } from "../../../components/ButtonComponent/ButtonComponent";
import { addEditCandidateApi } from "../../../services/Candidate/AddEditCandidate.query";
import { useMutation } from "@tanstack/react-query";
import { BreadCrumbsComponent } from "../../../components/Breadcrumbs/BreadCrumbsComponents";
import { toast } from "react-toastify";
import { FormField } from "../../../components/FormFieldComponent/FormFieldComponent";

const defaultValues: Partial<Candidate> = {
  id: "",
  date: "",
  name: "",
  contact_No: "",
  linkedin_Profile: "",
  email_ID: "",
  roles: "",
  experience: "",
  skills: "",
  ctc: "",
  etc: "",
  notice_Period: "",
  current_Location: "",
  prefer_Location: "",
  reason_For_Job_Change: "",
  schedule_Interview: "",
  schedule_Interview_status: "",
  comments: "",
  cv: null,
};

const CandidateForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state as Partial<Candidate> | undefined;
  const {
    handleSubmit,
    setValue,
    register,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<Candidate>({ defaultValues });

  useEffect(() => {
    if (editData) {
      Object.entries(editData).forEach(([key, value]) => {
        setValue(key as string, value as never);
      });
    }
  }, [editData, setValue]);

  const { mutate: submitCandidate } = useMutation({
    mutationFn: (formData: FormData) => addEditCandidateApi(formData),
    onSuccess: (data) => {
      if (data.isSuccess) toast.success(data.message);
      else toast.warning(data.message);
      reset(defaultValues);
      navigate("/candidates");
    },
    onError: () => {},
  });

  const onSubmit = (data: Candidate) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "id") {
          formData.append(key, data.id ? String(data.id) : "0");
        } else if (key === "cv" && value instanceof File) {
          formData.append(key, value, value.name);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    submitCandidate(formData);
  };

  return (
    <>
      <BreadCrumbsComponent />
      <div className="w-full max-w-2xl p-3">
        <h2 className="text-xl font-semibold">
          Candidate{" "}
          <span className="ml-10 text-red-700 font-1">
            Convert this page in tabs
          </span>
        </h2>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className=" bg-base-100 p-8 rounded-lg shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
          <input name="id" type="hidden" value={watch("id") || ""} />

          <FormField
            type="file"
            name="cv"
            label="Upload CV"
            setValue={setValue}
            registerOptions={{ required: "CV is required" }}
            error={errors.cv}
          />

          <FormField
            type="date"
            name="date"
            label="Date"
            placeholder="Enter date"
            register={register}
            registerOptions={{ required: "Date is required" }}
            error={errors.date}
          />

          <FormField
            type="text"
            name="name"
            label="Name"
            placeholder="Enter name"
            register={register}
            registerOptions={{ required: "Name is required" }}
            error={errors.name}
          />

          <FormField
            type="number"
            name="contact_No"
            label="Contact Number"
            placeholder="Enter contact number"
            register={register}
            registerOptions={{ required: "Contact Number is required" }}
            error={errors.contact_No}
          />

          <FormField
            type="text"
            name="linkedin_Profile"
            label="LinkedIn Profile"
            placeholder="Enter LinkedIn Profile URL"
            register={register}
            registerOptions={{ required: "LinkedIn Profile is required" }}
            error={errors.linkedin_Profile}
          />

          <FormField
            type="email"
            name="email_ID"
            label="Email"
            placeholder="Enter email"
            register={register}
            registerOptions={{ required: "Email is required" }}
            error={errors.email_ID}
          />

          <FormField
            type="text"
            name="experience"
            label="Experience"
            placeholder="Enter experience"
            register={register}
            registerOptions={{ required: "Experience is required" }}
            error={errors.experience}
          />

          <FormField
            type="text"
            name="skills"
            label="Skills"
            placeholder="Enter skills"
            register={register}
            registerOptions={{ required: "Skills are required" }}
            error={errors.skills}
          />

          <FormField
            type="number"
            name="ctc"
            label="CTC"
            placeholder="Enter CTC"
            register={register}
            registerOptions={{ required: "CTC is required" }}
            error={errors.ctc}
          />

          <FormField
            type="number"
            name="etc"
            label="ETC"
            placeholder="Enter ETC"
            register={register}
            registerOptions={{ required: "ETC is required" }}
            error={errors.etc}
          />

          <FormField
            type="number"
            name="notice_Period"
            label="Notice Period"
            placeholder="Enter Notice Period"
            register={register}
            registerOptions={{ required: "Notice Period is required" }}
            error={errors.notice_Period}
          />

          <FormField
            type="text"
            name="current_Location"
            label="Current Location"
            placeholder="Enter current location"
            register={register}
            registerOptions={{ required: "Current Location is required" }}
            error={errors.current_Location}
          />

          <FormField
            type="text"
            name="prefer_Location"
            label="Preferred Location"
            placeholder="Enter preferred location"
            register={register}
            registerOptions={{ required: "Preferred Location is required" }}
            error={errors.prefer_Location}
          />

          <FormField
            type="text"
            name="reason_For_Job_Change"
            label="Reason For Job Change"
            placeholder="Enter reason for job change"
            register={register}
            registerOptions={{ required: "Reason For Job Change is required" }}
            error={errors.reason_For_Job_Change}
          />

          <FormField
            type="datetime-local"
            name="schedule_Interview"
            label="Schedule Interview"
            register={register}
            registerOptions={{ required: "Schedule Interview is required" }}
            error={errors.schedule_Interview}
          />
          <FormField
            type="radio"
            name="schedule_Interview_status"
            label="Interview Status"
            register={register}
            registerOptions={{ required: "Interview Status is required" }}
            error={errors.schedule_Interview_status}
            options={[
              {
                label: "Needs Improvement",
                value: "Needs Improvement",
                style: "text-red-600",
              },
              {
                label: "Satisfactory",
                value: "Satisfactory",
                style: "text-yellow-600",
              },
              {
                label: "Outstanding",
                value: "Outstanding",
                style: "text-green-600",
              },
            ]}
          />

          <FormField
            type="textarea"
            name="roles"
            label="Roles"
            register={register}
            registerOptions={{ required: "Roles are required" }}
            error={errors.roles}
            rows={3}
          />

          <FormField
            type="textarea"
            name="comments"
            label="Comments"
            register={register}
            error={errors.comments}
            rows={3}
          />
        </div>
        <Button
          type="submit"
          text={isSubmitting ? "Submitting..." : "Submit"}
          className="bg-[rgb(66,42,213)] text-white mt-10 py-2 px-4 rounded disabled:opacity-50"
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

export default CandidateForm;
