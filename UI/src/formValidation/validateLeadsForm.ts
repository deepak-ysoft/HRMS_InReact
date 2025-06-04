import { ILeads } from "../types/ILeads.type";
import {
  validateEmail,
  validatePhoneNumber,
  validateRequired,
} from "../utils/validation/ValidationUtils";

export const validateLeadsForm = (form: ILeads) => {
  const errors: { [key: string]: string } = {};

  // post validation (required)
  errors.post = validateRequired(form.post, "Post");

  // email validation (required + format)
  errors.email =
    validateRequired(form.email, "Email") || validateEmail(form.email);

  // number validation (required + phone format)
  errors.number =
    validateRequired(form.number, "Contact Number") ||
    validatePhoneNumber(form.number, "Contact Number");

  // linkedInProfile (optional): if present, should be a valid URL
  if (form.linkedInProfile && form.linkedInProfile.trim()) {
    try {
      const url = new URL(form.linkedInProfile);
      if (!["http:", "https:"].includes(url.protocol)) {
        errors.linkedInProfile = "LinkedIn profile must be a valid URL.";
      }
    } catch {
      errors.linkedInProfile = "LinkedIn profile must be a valid URL.";
    }
  }

  // Filter out empty errors
  const filteredErrors = Object.fromEntries(
    Object.entries(errors).filter(([_, value]) => value !== "")
  );

  return filteredErrors;
};
