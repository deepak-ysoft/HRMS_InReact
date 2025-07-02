import React from "react";
import { format } from "date-fns";
import { EmployeeVM } from "../../../../types/IEmployee.type";
import { Button } from "../../../../components/ButtonComponent/ButtonComponent";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaUserTie,
  FaMapMarkerAlt,
} from "react-icons/fa";
import {
  MdDateRange,
  MdOutlineWork,
  MdAccountBalanceWallet,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface Props {
  data?: EmployeeVM;
}

const getRoleName = (role: number): string => {
  switch (role) {
    case 1:
      return "Admin";
    case 2:
      return "HR";
    case 3:
      return "Employee";
    default:
      return "Unknown";
  }
};

const getGenderName = (gender: number): string => {
  switch (gender) {
    case 0:
      return "Male";
    case 1:
      return "Female";
    case 2:
      return "Other";
    default:
      return "Unknown";
  }
};

const EmployeeDetails: React.FC<Props> = ({ data }) => {
  const apiPath = import.meta.env.VITE_API_BASE_URL;
  const nav = useNavigate();

  const handleGenerateSalary = () => {
    nav(`/employees/Payroll`, {
      state: { empId: data?.empId },
    });
  };

  return (
    <div className="bg-base-100 shadow-xl rounded-2xl p-6 md:p-10 max-w-6xl mx-auto font-inter">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6 border-b pb-6">
        <img
          src={
            data?.imagePath ? apiPath + data?.imagePath : "/default-avatar.png"
          }
          alt="Employee"
          className="w-32 h-32 object-cover rounded-full border-2 border-primary shadow-md"
        />
        <div className="lg:flex md:justify-between w-full">
          <div>
            <h2 className="text-3xl font-bold text-base-800">
              {data?.empName}
            </h2>
            <p className="text-gray-500">{data?.empJobTitle}</p>
          </div>
          <div className="mt-4 lg:w-1/3">
            <Button
              type="button"
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm"
              text="Generate Salary"
              onClick={handleGenerateSalary}
            />
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-base-800">
        <div className="space-y-3">
          <p className="flex items-center gap-2">
            <FaEnvelope className="text-primary" />{" "}
            <span>{data?.empEmail}</span>
          </p>
          <p className="flex items-center gap-2">
            <FaPhoneAlt className="text-primary" />{" "}
            <span>{data?.empNumber}</span>
          </p>
          <p className="flex items-center gap-2">
            <FaUserTie className="text-primary" />{" "}
            <span>Gender: {getGenderName(Number(data?.empGender))}</span>
          </p>
          <p className="flex items-center gap-2">
            <MdDateRange className="text-primary" />{" "}
            <span>
              Date of Birth:{" "}
              {data?.empDateOfBirth
                ? format(new Date(data.empDateOfBirth), "dd MMM yyyy")
                : "N/A"}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <MdOutlineWork className="text-primary" />{" "}
            <span>Experience: {data?.empExperience}</span>
          </p>
          <p className="flex items-center gap-2">
            <MdDateRange className="text-primary" />{" "}
            <span>
              Joining Date:{" "}
              {data?.empDateofJoining
                ? format(new Date(data.empDateofJoining), "dd MMM yyyy")
                : "N/A"}
            </span>
          </p>
        </div>

        <div className="space-y-3">
          <p className="flex items-center gap-2">
            <MdOutlineWork className="text-primary" />{" "}
            <span>Role: {getRoleName(Number(data?.role ?? -1))}</span>
          </p>
          <p className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-primary" />{" "}
            <span>{data?.empAddress}</span>
          </p>
          <p className="flex items-center gap-2">
            <MdAccountBalanceWallet className="text-primary" />{" "}
            <span>Basic Salary: ₹{data?.basicSalary}</span>
          </p>
          <p className="flex items-center gap-2">
            <MdAccountBalanceWallet className="text-primary" />{" "}
            <span>HRA: ₹{data?.hra}</span>
          </p>
          <p className="flex items-center gap-2">
            <MdAccountBalanceWallet className="text-primary" />{" "}
            <span>Special Allowance: ₹{data?.specialAllowance}</span>
          </p>
          <p className="flex items-center gap-2">
            <MdAccountBalanceWallet className="text-primary" />{" "}
            <span>Other Allowance: ₹{data?.otherAllowance}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
