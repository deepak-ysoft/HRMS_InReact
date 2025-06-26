import { Gender } from "../types/Enum/Gender";
import { UserRoles } from "../types/Enum/UserRoles";
import { Employee } from "../types/IEmployee.type";
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateRequired,
} from "../utils/validation/ValidationUtils";

export const validateEmployeeForm = (form: Employee) => {
  const errors: { [key: string]: string } = {};

  // Name
  errors.empName = validateRequired(form.empName, "Employee Name");

  // Email
  errors.empEmail =
    validateRequired(form.empEmail, "Email") || validateEmail(form.empEmail);

  // Password
  errors.empPassword =
    validateRequired(form.empPassword, "Password") ||
    validatePassword(form.empPassword, "Password");

  // Confirm Password
  if (form.empPasswordConfirm !== undefined) {
    errors.empPasswordConfirm = validateConfirmPassword(
      form.empPassword,
      form.empPasswordConfirm
    );
  }

  // Contact Number
  errors.empNumber =
    validateRequired(form.empNumber, "Contact Number") ||
    validatePhoneNumber(form.empNumber, "Contact Number");

  // Date of Birth
  errors.empDateOfBirth = validateRequired(
    form.empDateOfBirth,
    "Date of Birth"
  );

  // Gender (enum check)
  if (
    form.empGender === undefined ||
    !Object.values(Gender).includes(form.empGender)
  ) {
    errors.empGender = "Gender is required and must be valid.";
  }

  // Job Title
  errors.empJobTitle = validateRequired(form.empJobTitle, "Job Title");

  // Experience
  errors.empExperience = validateRequired(form.empExperience, "Experience");

  // Date of Joining
  errors.empDateofJoining = validateRequired(
    form.empDateofJoining,
    "Date of Joining"
  );

  // Address
  errors.empAddress = validateRequired(form.empAddress, "Address");

  // Role (enum check)
  if (
    form.role === undefined ||
    !Object.values(UserRoles).includes(form.role)
  ) {
    errors.role = "Role is required and must be valid.";
  }

  // Optional image validation
  if (form.photo) {
    if (form.photo.size > 5 * 1024 * 1024) {
      errors.photo = "Photo must be less than 5MB.";
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(form.photo.type)) {
      errors.photo = "Photo must be a JPG, PNG, or WebP file.";
    }
  }

  // Filter out fields with no errors
  const filteredErrors = Object.fromEntries(
    Object.entries(errors).filter(([, value]) => value !== "")
  );

  return filteredErrors;
};
