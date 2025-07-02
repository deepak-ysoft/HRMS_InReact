export interface Employee {
  empId: number;

  // Personal Information
  empName: string;
  empEmail: string;
  empPassword: string;
  empPasswordConfirm?: string; // Used only on frontend validation
  empNumber: string;
  empDateOfBirth: string; // YYYY-MM-DD format
  empGender: "Male" | "Female" | "Other";

  // Employment Details
  empJobTitle: string;
  empExperience: string;
  empDateofJoining: string; // YYYY-MM-DD
  empAddress: string;
  role: "Admin" | "HR" | "Employee";
  isActive?: boolean;

  // Photo Upload
  imagePath?: string;
  photo?: File | null;

  // Salary & Payroll Fields
  basicSalary: number;
  hra: number;
  conveyanceAllowance: number;
  specialAllowance: number;
  otherAllowance: number;

  // Identification
  pan: string;
  uan: string;

  // Bank Details
  bankAccountNumber: string;
  ifscCode: string;
  bankName: string;

  // Optional system properties
  isDelete?: boolean;
  resetToken?: string;
  resetTokenExpiration?: string; // ISO string
  resetTokenIsValid?: boolean;
}

export interface EmployeeVM {
  empId: number;
  empName: string;
  empEmail: string;
  empPassword: string;
  empPasswordConfirm?: string;

  empNumber: string;
  empDateOfBirth: string; // ISO 8601
  empGender: "Male" | "Female" | "Other"; // 🔥 Make this defined
  empJobTitle: string;
  empExperience: string;
  empDateofJoining: string;
  empAddress: string;

  imagePath?: string; // lowercase 'imagePath' used in your interface
  photo?: File | null;

  isDelete?: boolean;
  isActive?: boolean;

  role: 1 | 2 | 3; // 🔥 Use enum values directly (Admin=1, HR=2, Employee=3)

  resetToken?: string;
  resetTokenExpiration?: string;
  resetTokenIsValid?: boolean;

  basicSalary: number; // 🔥 Add if used in EmployeeDetails
  hra: number; // 🔥 Add if used in EmployeeDetails
  conveyanceAllowance: number;
  specialAllowance: number;
  otherAllowance: number;
}
