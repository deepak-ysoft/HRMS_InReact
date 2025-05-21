export enum LeaveType {
  FullDay = 0,
  MorningHalfDay = 1,
  EveningHalfDay = 2,
}

export const LeaveTypeLabels: Record<LeaveType, string> = {
  [LeaveType.FullDay]: "Full Day",
  [LeaveType.MorningHalfDay]: "Morning Half Day",
  [LeaveType.EveningHalfDay]: "Evening Half Day",
};