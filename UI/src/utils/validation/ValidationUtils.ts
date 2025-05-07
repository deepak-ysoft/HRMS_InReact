// validationUtils.ts

export const validateRequired = (value: string, fieldName: string) => {
  if (!value.trim()) {
    return `${fieldName} is required.`;
  }
  return "";
};

export const validateEmail = (value: string) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(value)) {
    return "Please enter a valid email address.";
  }
  return "";
};

export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string
) => {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long.`;
  }
  return "";
};

export const validateMaxLength = (
  value: string,
  maxLength: number,
  fieldName: string
) => {
  if (value.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters long.`;
  }
  return "";
};

export const validatePhoneNumber = (value: string, fieldName: string) => {
  const regex = /^\+?[0-9 ]{10,14}$/;
  if (!regex.test(value)) {
    return `${fieldName} must be a valid phone number.`;
  }
  return "";
};

export const validateNumber = (value: string | number, fieldName: string) => {
  if (isNaN(Number(value))) {
    return `${fieldName} must be a valid number.`;
  }
  return "";
};

// New password validation
export const validatePassword = (value: string, fieldName: string) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!regex.test(value)) {
    return `${fieldName} must be at least 8 characters, with at least one uppercase letter, one lowercase letter, one number, and one special character.`;
  }
  return "";
};

// Confirm password validation (compared to password)
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
) => {
  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }
  return "";
};
