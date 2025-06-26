export interface AttendanceRecord {
  id: number;
  employeeId: number;
  employee: string;
  date: string; // Stored as DateTime on backend, but often displayed as date string
  checkIn: string | null; // Nullable DateTime on backend, represented as string
  checkOut: string | null; // Nullable DateTime on backend, represented as string
  status: string;
  remarks: string;
}
