import React from "react";
import { useLocation } from "react-router-dom";
import { Candidate } from "../../../types/ICandidate";
import { BreadCrumbsComponent } from "../../../components/Breadcrumbs/BreadCrumbsComponents";
import CustomInput from "../../../components/FormFieldComponent/InputComponent";
import { Button } from "../../../components/ButtonComponent/ButtonComponent";
import { FaDownload } from "react-icons/fa";
const CandidateDetails: React.FC = () => {
  const location = useLocation();
  const candidate: Candidate = location.state as Candidate;

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
            <CustomInput
              label="Name"
              name="name"
              value={candidate.name || "-"}
              onChange={() => {}}
            />
            <CustomInput
              label="Email"
              name="email_ID"
              value={candidate.email_ID || "-"}
              onChange={() => {}}
            />
            <CustomInput
              label="Contact No"
              name="contact_No"
              value={candidate.contact_No || "-"}
              onChange={() => {}}
            />
            <CustomInput
              label="LinkedIn"
              name="linkedin_Profile"
              value={candidate.linkedin_Profile || "-"}
              onChange={() => {}}
            />
            <CustomInput
              label="Roles"
              name="roles"
              value={candidate.roles || "-"}
              onChange={() => {}}
            />
            <CustomInput
              label="Current Location"
              name="current_Location"
              value={candidate.current_Location || "-"}
              onChange={() => {}}
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
            <CustomInput
              label="Preferred Location"
              name="prefer_Location"
              value={candidate.prefer_Location || "-"}
              onChange={() => {}}
            />
            <CustomInput
              label="Experience"
              name="experience"
              value={candidate.experience || "-"}
              onChange={() => {}}
            />
            <CustomInput
              label="Skills"
              name="skills"
              value={candidate.skills || "-"}
              onChange={() => {}}
            />
            <CustomInput
              label="CTC"
              name="ctc"
              value={candidate.ctc || "-"}
              onChange={() => {}}
            />
            <CustomInput
              label="ETC"
              name="etc"
              value={candidate.etc || "-"}
              onChange={() => {}}
            />
            <CustomInput
              label="Notice Period"
              name="notice_Period"
              value={candidate.notice_Period || "-"}
              onChange={() => {}}
            />
            <CustomInput
              label="Schedule Interview"
              name="schedule_Interview"
              value={candidate.schedule_Interview || "-"}
              onChange={() => {}}
            />
            <CustomInput
              label="Interview Status"
              name="schedule_Interview_status"
              value={candidate.schedule_Interview_status || "-"}
              onChange={() => {}}
            />
            <CustomInput
              label="Reason For Job Change"
              name="reason_For_Job_Change"
              value={candidate.reason_For_Job_Change || "-"}
              onChange={() => {}}
            />
            <CustomInput
              label="Comments"
              name="comments"
              value={candidate.comments || "-"}
              onChange={() => {}}
            />
            <CustomInput
              label="Date"
              name="date"
              value={candidate.date || "-"}
              onChange={() => {}}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidateDetails;
