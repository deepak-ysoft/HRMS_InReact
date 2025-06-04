import React from "react";
import { useLocation } from "react-router-dom";
import { Candidate } from "../../../types/ICandidate";
import { BreadCrumbsComponent } from "../../../components/Breadcrumbs/BreadCrumbsComponents";
import { Button } from "../../../components/ButtonComponent/ButtonComponent";
import { FaDownload } from "react-icons/fa";
import { FormField } from "../../../components/FormFieldComponent/FormFieldComponent";
import { useForm } from "react-hook-form";

const CandidateDetails: React.FC = () => {
  const location = useLocation();
  const candidate: Candidate = location.state as Candidate;

  // Set up react-hook-form with default values from candidate
  const { register } = useForm<Candidate>({
    defaultValues: candidate,
  });

  return (
    <>
      <BreadCrumbsComponent />

      <div className="mb-4 w-full pl-5">
        <h1 className="text-3xl font-bold mb-6 text-base-800">
          Candidate Details
        </h1>
        <div className="grid grid-cols-6 gap-8">
          {/* Profile Details Box */}
          <div className="col-span-2  rounded-lg p-6 bg-base-100 shadow-md mb-4">
            <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
            <FormField
              type="text"
              label="Name"
              name="name"
              register={register}
              disabled
            />
            <FormField
              type="text"
              label="Email"
              name="email_ID"
              register={register}
              disabled
            />
            <FormField
              type="text"
              label="Contact No"
              name="contact_No"
              register={register}
              disabled
            />
            <FormField
              type="text"
              label="LinkedIn"
              name="linkedin_Profile"
              register={register}
              disabled
            />
            <FormField
              type="text"
              label="Roles"
              name="roles"
              register={register}
              disabled
            />
            <FormField
              type="text"
              label="Current Location"
              name="current_Location"
              register={register}
              disabled
            />
          </div>
          {/* Other Details Box */}
          <div className="col-span-4 grid grid-cols-2 gap-4 rounded-lg p-6 bg-base-100 shadow-md mb-4">
            <h2 className="text-xl font-semibold mb-4">Other Details</h2>
            <div className="mb-2 flex items-center justify-end ">
              {candidate.cvPath ? (
                <a href={candidate.cvPath} download>
                  <Button
                    type="button"
                    text={
                      <>
                        Download CV
                        <FaDownload className="inline-block ml-2" />
                      </>
                    }
                    className="bg-[rgb(66,42,213)]"
                  />
                </a>
              ) : candidate.cv &&
                typeof candidate.cv === "object" &&
                "name" in candidate.cv &&
                "size" in candidate.cv ? (
                <a
                  href={URL.createObjectURL(candidate.cv as Blob)}
                  download={candidate.cv.name}
                >
                  <Button
                    type="button"
                    text={
                      <>
                        Download CV
                        <FaDownload className="inline-block ml-2" />
                      </>
                    }
                    className="bg-[rgb(66,42,213)] "
                  />
                </a>
              ) : (
                <Button
                  type="button"
                  text={
                    <>
                      Download CV
                      <FaDownload className="inline-block ml-2" />
                    </>
                  }
                  className="bg-[rgb(66,42,213)] cursor-not-allowed opacity-60"
                  disabled
                />
              )}
            </div>
            <FormField
              type="text"
              label="Preferred Location"
              name="prefer_Location"
              register={register}
              disabled
            />
            <FormField
              type="text"
              label="Experience"
              name="experience"
              register={register}
              disabled
            />
            <FormField
              type="text"
              label="Skills"
              name="skills"
              register={register}
              disabled
            />
            <FormField
              type="text"
              label="CTC"
              name="ctc"
              register={register}
              disabled
            />
            <FormField
              type="text"
              label="ETC"
              name="etc"
              register={register}
              disabled
            />
            <FormField
              type="text"
              label="Notice Period"
              name="notice_Period"
              register={register}
              disabled
            />
            <FormField
              type="text"
              label="Schedule Interview"
              name="schedule_Interview"
              register={register}
              disabled
            />
            <FormField
              type="text"
              label="Interview Status"
              name="schedule_Interview_status"
              register={register}
              disabled
            />
            <FormField
              type="text"
              label="Reason For Job Change"
              name="reason_For_Job_Change"
              register={register}
              disabled
            />
            <FormField
              type="text"
              label="Comments"
              name="comments"
              register={register}
              disabled
            />
            <FormField
              type="text"
              label="Date"
              name="date"
              register={register}
              disabled
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidateDetails;
