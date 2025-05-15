// validateForm.ts
import { Candidate } from "../../types/ICandidate";
import {
  validateEmail,
  validateNumber,
  validatePhoneNumber,
  validateRequired,
} from "../../utils/validation/ValidationUtils";

export const validateForm = (form: Candidate) => {
  const errors: { [key: string]: string } = {};

  console.log("Form values for validation:", form); // Log form values for debugging

  // Date validation (required)
  errors.date = validateRequired(form.date, "date");
  console.log("Date validation result:", errors.date); // Log validation result

  // Name validation (required)
  errors.name = validateRequired(form.name, "name");
  console.log("Name validation result:", errors.name); // Log validation result

  // Contact number validation (required + regex for phone number)
  errors.contact_No =
    validateRequired(form.contact_No, "contact_No") ||
    validatePhoneNumber(form.contact_No, "contact_No");
  console.log("Contact number validation result:", errors.contact_No); // Log validation result

  // Email validation (required + email format)
  errors.email_ID =
    validateRequired(form.email_ID, "email_ID") || validateEmail(form.email_ID);
  console.log("Email validation result:", errors.email_ID); // Log validation result

  // CTC validation (required + must be a number)
  errors.ctc =
    validateRequired(form.ctc.toString(), "ctc") ||
    validateNumber(form.ctc, "ctc");
  console.log("CTC validation result:", errors.ctc); // Log validation result

  // ETC validation (required + must be a number)
  errors.etc =
    validateRequired(form.etc.toString(), "etc") ||
    validateNumber(form.etc, "etc");
  console.log("ETC validation result:", errors.etc); // Log validation result

  // Skills validation (required)
  errors.skills = validateRequired(form.skills, "skills");
  console.log("Skills validation result:", errors.skills); // Log validation result

  // Experience validation (required)
  errors.experience = validateRequired(form.experience, "experience");
  console.log("Experience validation result:", errors.experience); // Log validation result

  // Other validations for other fields (Notice Period, etc.)
  errors.notice_Period = validateRequired(form.notice_Period, "notice_Period");
  console.log("Notice Period validation result:", errors.notice_Period); // Log validation result

  errors.current_Location = validateRequired(
    form.current_Location,
    "current_Location"
  );
  console.log("Current Location validation result:", errors.current_Location); // Log validation result

  errors.prefer_Location = validateRequired(
    form.prefer_Location,
    "prefer_Location"
  );
  console.log("Preferred Location validation result:", errors.prefer_Location); // Log validation result

  errors.reason_For_Job_Change = validateRequired(
    form.reason_For_Job_Change,
    "reason_For_Job_Change"
  );
  console.log(
    "Reason for Job Change validation result:",
    errors.reason_For_Job_Change
  ); // Log validation result

  errors.schedule_Interview = validateRequired(
    form.schedule_Interview,
    "schedule_Interview"
  );
  console.log(
    "Schedule Interview validation result:",
    errors.schedule_Interview
  ); // Log validation result

  // Optionally add file validation for CV
  if (form.cv && form.cv.size > 5000000) {
    // Max file size 5MB
    errors.cv = "File size must be less than 5MB.";
    console.log("CV validation result:", errors.cv); // Log validation result
  }

  // Filter out fields with empty error messages
  const filteredErrors = Object.fromEntries(
    Object.entries(errors).filter(([_, value]) => value !== "")
  );

  console.log("Final validation errors:", filteredErrors); // Log all validation errors

  return filteredErrors;
};
