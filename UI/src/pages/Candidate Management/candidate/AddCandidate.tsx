import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Candidate } from "../../../types/ICandidate";
import CustomInput from "../../../components/FormFieldComponent/InputComponent";
import { validateCandidateForm } from "./ValidateFrom";
import { Button } from "../../../components/ButtonComponent/ButtonComponent";
import { addEditCandidateApi } from "../../../services/Candidate/AddEditCandidate.query";
import { useMutation } from "@tanstack/react-query";
import { BreadCrumbsComponent } from "../../../components/Breadcrumbs/BreadCrumbsComponents";
import { toast } from "react-toastify";

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
    reset,
    setError,
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
    const validationErrors = validateCandidateForm(data);
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([key, message]) => {
        setError(key as string, { type: "manual", message: message as string });
      });
      return;
    }
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
          <input
            name="id"
            type="hidden"
            value={watch("id") || ""}
            // register is not needed for hidden id, value is enough
          />
          <CustomInput
            label="CV Upload"
            name="cv"
            type="file"
            value={watch("cv") || ""}
            onChange={(e) => {
              const file = (e.target as HTMLInputElement).files?.[0] || null;
              setValue("cv", file);
            }}
            error={errors.cv?.message?.toString()}
          />

          <CustomInput
            label="Date"
            name="date"
            type="date"
            value={watch("date") || ""}
            onChange={(e) => setValue("date", e.target.value)}
            error={errors.date?.message?.toString()}
            required
          />
          <CustomInput
            label="Name"
            name="name"
            value={watch("name") || ""}
            onChange={(e) => setValue("name", e.target.value)}
            error={errors.name?.message?.toString()}
            required
          />
          <CustomInput
            label="Contact Number"
            name="contact_No"
            value={watch("contact_No") || ""}
            onChange={(e) => setValue("contact_No", e.target.value)}
            error={errors.contact_No?.message?.toString()}
            required
          />
          <CustomInput
            label="Linkedin Profile"
            name="linkedin_Profile"
            value={watch("linkedin_Profile") || ""}
            onChange={(e) => setValue("linkedin_Profile", e.target.value)}
            error={errors.linkedin_Profile?.message?.toString()}
            required
          />
          <CustomInput
            label="Email"
            name="email_ID"
            value={watch("email_ID") || ""}
            onChange={(e) => setValue("email_ID", e.target.value)}
            error={errors.email_ID?.message?.toString()}
            required
          />
          <CustomInput
            label="Experience"
            name="experience"
            value={watch("experience") || ""}
            onChange={(e) => setValue("experience", e.target.value)}
            error={errors.experience?.message?.toString()}
            required
          />
          <CustomInput
            label="Skills"
            name="skills"
            value={watch("skills") || ""}
            onChange={(e) => setValue("skills", e.target.value)}
            error={errors.skills?.message?.toString()}
            required
          />
          <CustomInput
            label="CTC"
            name="ctc"
            value={watch("ctc") || ""}
            onChange={(e) => setValue("ctc", e.target.value)}
            error={errors.ctc?.message?.toString()}
            required
          />
          <CustomInput
            label="ETC"
            name="etc"
            value={watch("etc") || ""}
            onChange={(e) => setValue("etc", e.target.value)}
            error={errors.etc?.message?.toString()}
            required
          />
          <CustomInput
            label="Notice Period"
            name="notice_Period"
            value={watch("notice_Period") || ""}
            onChange={(e) => setValue("notice_Period", e.target.value)}
            error={errors.notice_Period?.message?.toString()}
            required
          />
          <CustomInput
            label="Current Location"
            name="current_Location"
            value={watch("current_Location") || ""}
            onChange={(e) => setValue("current_Location", e.target.value)}
            error={errors.current_Location?.message?.toString()}
            required
          />
          <CustomInput
            label="Preferred Location"
            name="prefer_Location"
            value={watch("prefer_Location") || ""}
            onChange={(e) => setValue("prefer_Location", e.target.value)}
            error={errors.prefer_Location?.message?.toString()}
            required
          />
          <CustomInput
            label="Reason For Job Change"
            name="reason_For_Job_Change"
            value={watch("reason_For_Job_Change") || ""}
            onChange={(e) => setValue("reason_For_Job_Change", e.target.value)}
            error={errors.reason_For_Job_Change?.message?.toString()}
            required
          />
          <CustomInput
            label="Schedule Interview"
            name="schedule_Interview"
            type="datetime-local"
            value={watch("schedule_Interview") || ""}
            onChange={(e) => setValue("schedule_Interview", e.target.value)}
            error={errors.schedule_Interview?.message?.toString()}
            required
          />
          <CustomInput
            label="Interview Status"
            name="schedule_Interview_status"
            type="radio"
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
            value={watch("schedule_Interview_status") || ""}
            onChange={(e) =>
              setValue("schedule_Interview_status", e.target.value)
            }
            error={errors.schedule_Interview_status?.message?.toString()}
            className="mx-2 mt-6"
          />
          <CustomInput
            label="Roles"
            name="roles"
            type="textarea"
            value={watch("roles") || ""}
            onChange={(e) => setValue("roles", e.target.value)}
            error={errors.roles?.message?.toString()}
            rows={3}
            required
          />
          <CustomInput
            label="Comments"
            type="textarea"
            name="comments"
            value={watch("comments") || ""}
            onChange={(e) => setValue("comments", e.target.value)}
            error={errors.comments?.message?.toString()}
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
