import { EmployeeAsset } from "../types/IEmployeeAsset.types";
import {
  validateNumber,
  validateRequired,
} from "../utils/validation/ValidationUtils";

export const validateEmployeeAssetForm = (form: EmployeeAsset) => {
  const errors: { [key: string]: string } = {};

  // assetName validation (required)
  errors.assetName = validateRequired(form.assetName, "Asset Name");

  // description validation (required)
  errors.description = validateRequired(form.description, "Description");

  // empId validation (required and must be a valid number)
  errors.empId =
    validateRequired(form.empId.toString(), "Employee ID") ||
    validateNumber(form.empId, "Employee ID");

  // Optional: image file validation (e.g., max 5MB and type check)
  if (form.image) {
    if (form.image.size > 5 * 1024 * 1024) {
      errors.image = "Image size must be less than 5MB.";
    }

    const validImageTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validImageTypes.includes(form.image.type)) {
      errors.image = "Image must be a JPG, PNG, or WebP file.";
    }
  }

  // Filter out empty error messages
  const filteredErrors = Object.fromEntries(
    Object.entries(errors).filter(([_, value]) => value !== "")
  );

  return filteredErrors;
};
