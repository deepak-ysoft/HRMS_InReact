export interface EmployeeDocument {
  id: number;
  employeeId: number;
  documentType: string;
  fileName: string;
  uploadedAt: string; // DateTime on backend, represented as string
  expiryDate: string | null; // Nullable DateTime on backend, represented as string
}
