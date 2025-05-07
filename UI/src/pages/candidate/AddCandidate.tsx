import React, { useState } from "react";
import { Candidate } from "../../types/ICandidate";
import CustomInput from "../../components/FormFieldComponent/InputComponent";
import { validateForm } from "./ValidateFrom";

const CandidateForm = () => {
  const [form, setForm] = useState<
    Candidate & {
      password?: string;
      confirmPassword?: string;
    }
  >({
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
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<
    Partial<Candidate & { password?: string; confirmPassword?: string }>
  >({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateForm(form);

    if (form.password !== form.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      console.log("Form submitted", form);
      // Handle actual submission (API call)
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <CustomInput
        label="Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
        required
      />
      <CustomInput
        label="Contact Number"
        name="contact_No"
        value={form.contact_No}
        onChange={handleChange}
        error={errors.contact_No}
        required
      />
      <CustomInput
        label="Email"
        name="email_ID"
        value={form.email_ID}
        onChange={handleChange}
        error={errors.email_ID}
        required
      />
      <CustomInput
        label="Roles"
        name="roles"
        value={form.roles}
        onChange={handleChange}
        error={errors.roles}
        required
      />
      <CustomInput
        label="Experience"
        name="experience"
        value={form.experience}
        onChange={handleChange}
        error={errors.experience}
        required
      />
      <CustomInput
        label="Skills"
        name="skills"
        value={form.skills}
        onChange={handleChange}
        error={errors.skills}
        required
      />
      <CustomInput
        label="CTC"
        name="ctc"
        value={form.ctc}
        onChange={handleChange}
        error={errors.ctc}
        required
      />
      <CustomInput
        label="ETC"
        name="etc"
        value={form.etc}
        onChange={handleChange}
        error={errors.etc}
        required
      />
      <CustomInput
        label="Notice Period"
        name="notice_Period"
        value={form.notice_Period}
        onChange={handleChange}
        error={errors.notice_Period}
        required
      />
      <CustomInput
        label="Current Location"
        name="current_Location"
        value={form.current_Location}
        onChange={handleChange}
        error={errors.current_Location}
        required
      />
      <CustomInput
        label="Preferred Location"
        name="prefer_Location"
        value={form.prefer_Location}
        onChange={handleChange}
        error={errors.prefer_Location}
        required
      />
      <CustomInput
        label="Reason For Job Change"
        name="reason_For_Job_Change"
        value={form.reason_For_Job_Change}
        onChange={handleChange}
        error={errors.reason_For_Job_Change}
        required
      />
      <CustomInput
        label="Comments"
        name="comments"
        value={form.comments}
        onChange={handleChange}
        error={errors.comments}
        required
      />
      <CustomInput
        label="CV Upload"
        name="cv"
        type="file"
        value=""
        onChange={handleChange}
        error={typeof errors.cv === 'string' ? errors.cv : undefined}
      />
      {form.cv && (
        <p className="text-sm mt-1">Selected File: {(form.cv as File).name}</p>
      )}
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default CandidateForm;
