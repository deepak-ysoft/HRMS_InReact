// validateForm.ts
import { Candidate } from '../../types/ICandidate';
import { validateEmail, validateNumber, validatePhoneNumber, validateRequired } from '../../utils/validation/ValidationUtils';

export const validateForm = (form: Candidate) => {
  const errors: { [key: string]: string } = {};

  // Name validation (required)
  errors.name = validateRequired(form.name, 'Name');

  // Contact number validation (required + regex for phone number)
  errors.contact_No = validateRequired(form.contact_No, 'Contact Number') || validatePhoneNumber(form.contact_No, 'Contact Number');

  // Email validation (required + email format)
  errors.email_ID = validateRequired(form.email_ID, 'Email') || validateEmail(form.email_ID);

  // CTC validation (required + must be a number)
  errors.ctc = validateRequired(form.ctc.toString(), 'CTC') || validateNumber(form.ctc, 'CTC');

  // ETC validation (required + must be a number)
  errors.etc = validateRequired(form.etc.toString(), 'ETC') || validateNumber(form.etc, 'ETC');

  // Skills validation (required)
  errors.skills = validateRequired(form.skills, 'Skills');

  // Experience validation (required)
  errors.experience = validateRequired(form.experience, 'Experience');

  // Other validations for other fields (Notice Period, etc.)
  errors.notice_Period = validateRequired(form.notice_Period, 'Notice Period');
  errors.current_Location = validateRequired(form.current_Location, 'Current Location');
  errors.prefer_Location = validateRequired(form.prefer_Location, 'Preferred Location');
  errors.reason_For_Job_Change = validateRequired(form.reason_For_Job_Change, 'Reason for Job Change');
  errors.comments = validateRequired(form.comments, 'Comments');

  // Optionally add file validation for CV
  if (form.cv && form.cv.size > 5000000) { // Max file size 5MB
    errors.cv = 'File size must be less than 5MB.';
  }

  return errors;
};
