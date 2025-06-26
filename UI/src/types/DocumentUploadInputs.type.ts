export interface DocumentUploadInputs {
  employeeId: number; // Input as string, converted to number for API
  documentType: string;
  expiryDate?: string; // Optional expiry date
  file: FileList; // For file input
}
