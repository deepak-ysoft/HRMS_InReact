import { ICalendar } from "../types/ICalendar.type";
import { validateRequired } from "../utils/validation/ValidationUtils";

export const validateCalendarForm = (form: ICalendar) => {
  const errors: { [key: string]: string } = {};

  // Title (required)
  errors.title = validateRequired(form.title, "Title");

  // Description (required)
  errors.description = validateRequired(form.description, "Description");

  // Start date (required)
  errors.start = validateRequired(form.start, "Start Date");

  // End date (required)
  errors.end = validateRequired(form.end, "End Date");

  // Optional: check if end date is after start date
  if (form.start && form.end && new Date(form.end) < new Date(form.start)) {
    errors.end = "End Date must be after Start Date.";
  }

  // Filter out empty errors
  const filteredErrors = Object.fromEntries(
    Object.entries(errors).filter(([_, value]) => value !== "")
  );

  return filteredErrors;
};
