import React, { useState } from "react";
import { Candidate } from "../../types/ICandidate";
import CustomInput from "../../components/FormFieldComponent/InputComponent";
import { validateForm } from "./ValidateFrom";
import { Button } from "../../components/ButtonComponent/ButtonComponent";

const CandidateForm = () => {
  const [form, setForm] = useState<Candidate>({
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
  });

  const [errors, setErrors] = useState<Partial<Candidate>>({});

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

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      // Handle actual submission (API call)
    }

    setIsSubmitting(false);
  };

  const handleReset = () => {
    setForm({
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
    });
    setErrors({});
  };

  return (
    <>
      <div className="w-full max-w-2xl p-3">
        <h2 className="text-xl font-semibold">Candidate</h2>
      </div>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className=" bg-base-100 p-8 rounded-lg shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
          <CustomInput
            label="CV Upload"
            name="cv"
            type="file"
            value=""
            onChange={handleChange}
            error={typeof errors.cv === "string" ? errors.cv : undefined}
          />
          {form.cv && (
            <p className="text-sm mt-1">
              Selected File: {(form.cv as File).name}
            </p>
          )}
          <CustomInput
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            error={errors.date}
            required
          />
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
            label="Linkedin Profile"
            name="linkedin_Profile"
            value={form.linkedin_Profile}
            onChange={handleChange}
            error={errors.linkedin_Profile}
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
            label="Schedule Interview"
            name="schedule_Interview"
            type="datetime-local"
            value={form.schedule_Interview}
            onChange={handleChange}
            error={errors.schedule_Interview}
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
            value={form.schedule_Interview_status}
            className="mx-2 mt-6"
            onChange={handleChange}
            error={errors.schedule_Interview_status}
          />

          <CustomInput
            label="Roles"
            name="roles"
            type="textarea"
            value={form.roles}
            onChange={handleChange}
            error={errors.roles}
            rows={3}
            required
          />
          <CustomInput
            label="Comments"
            type="textarea"
            name="comments"
            value={form.comments}
            onChange={handleChange}
            error={errors.comments}
            rows={3}
          />
        </div>

        <Button
          type="submit"
          text={`${isSubmitting ? "Submitting..." : "Submit"}`}
          className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
        />
        <Button
          type="button"
          text="Reset"
          onClick={handleReset}
          className="bg-gray-500 text-white py-2 px-4 rounded ml-4"
        />
      </form>
    </>
  );
};

export default CandidateForm;
