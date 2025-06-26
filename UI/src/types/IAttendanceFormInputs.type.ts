export interface AttendanceFormInputs {
  employeeId: string; // Employee ID will be a string from input, converted to int for API
  remarks?: string; // Optional remarks
}

export interface HistoryFilterInputs {
  employeeId: string; // Input as string, converted to number for API
  startDate?: string;
  endDate?: string;
}
