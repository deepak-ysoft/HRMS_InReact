import { Gender } from "./Enum/Gender";
import { UserRoles } from "./Enum/UserRoles";

export interface Employee {
  empId: number;
  empName: string;
  empEmail: string;
  empPassword: string;
  empPasswordConfirm?: string; // Not mapped to DB, used only in frontend
  empNumber: string;
  empDateOfBirth: string; // ISO 8601 date string
  empGender: Gender;
  empJobTitle: string;
  empExperience: string;
  empDateofJoining: string; // ISO 8601 date string
  empAddress: string;
  imagePath?: string;
  photo?: File | null; // For file upload
  isDelete?: boolean;
  role: UserRoles;
  isActive?: boolean;
  resetToken?: string;
  resetTokenExpiration?: string; // ISO string
  resetTokenIsValid?: boolean; // Optional if computed only on backend
}
