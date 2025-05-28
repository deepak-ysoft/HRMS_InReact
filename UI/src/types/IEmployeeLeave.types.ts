import { LeaveApprovel } from "./Enum/LeaveApprovel";
import { LeaveType } from "./Enum/LeaveType";

export interface EmployeeLeave {
  leaveId: number;
  leaveFor: string;
  leaveType: LeaveType;
  startDate: string; // ISO 8601 date string
  endDate: string; // ISO 8601 date string
  empId: number;
  isDelete: boolean;
  isApprove?: LeaveApprovel;
}
