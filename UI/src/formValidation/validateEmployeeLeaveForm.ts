import { LeaveApprovel } from "../types/Enum/LeaveApprovel";
import { EmployeeLeave } from "../types/IEmployeeLeave.types";
import { validateRequired } from "../utils/validation/ValidationUtils";

export const validateEmployeeLeaveForm = (form: EmployeeLeave) => {
  const errors: { [key: string]: string } = {};

  // leaveFor validation (required)
  errors.leaveFor = validateRequired(form.leaveFor, "Leave For");

  // leaveType validation (required, assuming it's an enum)
  if (form.leaveType === undefined || form.leaveType === null) {
    errors.leaveType = "Leave Type is required.";
  }

  // startDate validation
  errors.startDate = validateRequired(form.startDate, "Start Date");

  // endDate validation
  errors.endDate = validateRequired(form.endDate, "End Date");

  // empId validation
  if (!form.empId && form.empId !== 0) {
    errors.empId = "Employee ID is required.";
  }

  // Optional: Validate date range
  if (
    form.startDate &&
    form.endDate &&
    new Date(form.startDate) > new Date(form.endDate)
  ) {
    errors.endDate = "End Date cannot be before Start Date.";
  }

  // Optional: isApprove (enum, optional field)
  if (
    form.isApprove !== undefined &&
    !Object.values(LeaveApprovel).includes(form.isApprove)
  ) {
    errors.isApprove = "Invalid leave approval status.";
  }

  // Filter out empty errors
  const filteredErrors = Object.fromEntries(
    Object.entries(errors).filter(([_, value]) => value !== "")
  );

  return filteredErrors;
};
