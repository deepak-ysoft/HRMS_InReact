// validateForm.ts
import { Candidate } from "../../../types/ICandidate";
import {
  validateEmail,
  validateNumber,
  validatePhoneNumber,
  validateRequired,
} from "../../../utils/validation/ValidationUtils";

export const validateCandidateForm = (form: Candidate) => {
  const errors: { [key: string]: string } = {};

  // Date validation (required)
  errors.date = validateRequired(form.date, "date");

  // Name validation (required)
  errors.name = validateRequired(form.name, "name");

  // Contact number validation (required + regex for phone number)
  errors.contact_No =
    validateRequired(form.contact_No, "contact_No") ||
    validatePhoneNumber(form.contact_No, "contact_No");

  // Email validation (required + email format)
  errors.email_ID =
    validateRequired(form.email_ID, "email_ID") || validateEmail(form.email_ID);

  // CTC validation (required + must be a number)
  errors.ctc =
    validateRequired(form.ctc.toString(), "ctc") ||
    validateNumber(form.ctc, "ctc");

  // ETC validation (required + must be a number)
  errors.etc =
    validateRequired(form.etc.toString(), "etc") ||
    validateNumber(form.etc, "etc");

  // Skills validation (required)
  errors.skills = validateRequired(form.skills, "skills");

  // Experience validation (required)
  errors.experience = validateRequired(form.experience, "experience");

  // Other validations for other fields (Notice Period, etc.)
  errors.notice_Period = validateRequired(form.notice_Period, "notice_Period");

  errors.current_Location = validateRequired(
    form.current_Location,
    "current_Location"
  );

  errors.prefer_Location = validateRequired(
    form.prefer_Location,
    "prefer_Location"
  );

  errors.reason_For_Job_Change = validateRequired(
    form.reason_For_Job_Change,
    "reason_For_Job_Change"
  );

  errors.schedule_Interview = validateRequired(
    form.schedule_Interview,
    "schedule_Interview"
  );

  // Optionally add file validation for CV
  if (form.cv && form.cv.size > 5000000) {
    // Max file size 5MB
    errors.cv = "File size must be less than 5MB.";
  }

  // Filter out fields with empty error messages
  const filteredErrors = Object.fromEntries(
    Object.entries(errors).filter(([_, value]) => value !== "")
  );
  return filteredErrors;
};
