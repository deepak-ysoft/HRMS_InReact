import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Employee } from "../../../types/IEmployee.type";
import { FormField } from "../../../components/FormFieldComponent/FormFieldComponent";
import { Button } from "../../../components/ButtonComponent/ButtonComponent";
import { AddEmployeeasync } from "../../../services/Employee Management/Employee/AddEmployee.query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BreadCrumbsComponent } from "../../../components/Breadcrumbs/BreadCrumbsComponents";
import { UserRoles } from "../../../types/Enum/UserRoles";
import { EditEmployeeasync } from "../../../services/Employee Management/Employee/EditEmployee.query";
import { Gender } from "../../../types/Enum/Gender";
import { toast } from "react-toastify";
import { Tab, Tabs } from "../../../components/Tabs/Tabs";
import { EmployeeDetailsQuery } from "../../../services/Employee Management/Employee/EmployeeDetailsquery";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";

const defaultValues: Partial<Employee> = {
  empId: 0,
  empName: "",
  empEmail: "",
  empPassword: "",
  empPasswordConfirm: "",
  empNumber: "",
  empDateOfBirth: "",
  empGender: undefined,
  empJobTitle: "",
  empExperience: "",
  empDateofJoining: "",
  empAddress: "",
  imagePath: "",
  photo: null,
  isDelete: false,
  role: undefined,
  isActive: true,
  resetToken: "",
  resetTokenExpiration: "",
  resetTokenIsValid: false,
  basicSalary: 0,
  hra: 0,
  conveyanceAllowance: 0,
  specialAllowance: 0,
  otherAllowance: 0,
  uan: "",
  pan: "",
  bankAccountNumber: "",
  ifscCode: "",
  bankName: "",
};

export const EmployeeForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state as number;
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
    register,
    trigger,
  } = useForm<Employee>({ defaultValues });

  const [activeTab, setActiveTab] = useState(0);
  const tabNames = ["personal", "job", "salary", "bank"];
  const tabCount = tabNames.length;

  const { data } = useQuery({
    queryKey: ["getEmployee", editData],
    queryFn: () => EmployeeDetailsQuery(editData),
  });

  useEffect(() => {
    if (data?.data?.employee) {
      const employee = data.data.employee;

      Object.entries(employee).forEach(([key, value]) => {
        if (
          (key === "empDateofJoining" || key === "empDateOfBirth") &&
          typeof value === "string"
        ) {
          const formattedDate = new Date(value).toISOString().split("T")[0];
          setValue(key as keyof Employee, formattedDate as never);
        } else {
          setValue(key as keyof Employee, value as never);
        }
      });
    }
  }, [data?.data?.employee, setValue]);

  const tabFieldGroups: Record<string, (keyof Employee)[]> = {
    personal: [
      "photo",
      "empName",
      "empEmail",
      "empPassword",
      "empPasswordConfirm",
      "empNumber",
      "empDateOfBirth",
      "empGender",
      "empAddress",
    ],
    job: ["empJobTitle", "empExperience", "empDateofJoining", "role"],
    salary: [
      "basicSalary",
      "hra",
      "conveyanceAllowance",
      "specialAllowance",
      "otherAllowance",
    ],

    bank: ["pan", "bankAccountNumber", "ifscCode", "bankName"],
  };

  const validateTab = async (tabKey: string) => {
    const fields = tabFieldGroups[tabKey];
    return await trigger(fields);
  };

  const { mutate: submitEmployee } = useMutation({
    mutationFn: (formData: FormData) => AddEmployeeasync(formData),
    onSuccess: (data) => {
      if (data.isSuccess) toast.success(data.message);
      else toast.warning(data.message);
      reset(defaultValues);
      navigate("/employees");
    },
  });

  const { mutate: submitEmployeeEdit } = useMutation({
    mutationFn: (formData: FormData) => EditEmployeeasync(formData),
    onSuccess: (data) => {
      if (data.isSuccess) toast.success(data.message);
      else toast.warning(data.message);
      reset(defaultValues);
      navigate("/employees");
    },
  });

  const nextTab = async () => {
    const currentTabName = tabNames[activeTab];
    const isValid = await validateTab(currentTabName);
    if (!isValid) return;

    if (activeTab < tabCount - 1) {
      setActiveTab(activeTab + 1);
    }
  };

  const prevTab = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  const onSubmit = (data: Employee) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "empId") {
          formData.append("empId", data.empId ? String(data.empId) : "0");
        } else if (key === "photo") {
          const fileList = value as FileList;
          if (fileList && fileList.length > 0) {
            formData.append("photo", fileList[0], fileList[0].name); // ✅ important!
          }
        } else {
          formData.append(key, String(value));
        }
      }
    });

    if (editData) submitEmployeeEdit(formData);
    else submitEmployee(formData);
  };

  return (
    <>
      <BreadCrumbsComponent />
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">
          {editData ? "Edit" : "Add"} Employee
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="bg-base-100 p-6 rounded-lg shadow min-h-[62vh] flex flex-col"
        >
          <Tabs mode="edit" activeTab={activeTab} setActiveTab={setActiveTab}>
            <Tab title="Personal Info" name="personal">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  type="file"
                  name="photo"
                  label="Photo"
                  setValue={setValue}
                  registerOptions={{
                    required: !editData && "Photo is required",
                  }}
                  error={errors.photo}
                />
                <FormField
                  type="text"
                  name="empName"
                  label="Name"
                  register={register}
                  registerOptions={{ required: "Name is required" }}
                  error={errors.empName}
                />
                <FormField
                  type="email"
                  name="empEmail"
                  label="Email"
                  register={register}
                  registerOptions={{ required: "Email is required" }}
                  error={errors.empEmail}
                />
                {!editData && (
                  <FormField
                    type="password"
                    name="empPassword"
                    label="Password"
                    register={register}
                    registerOptions={{ required: "Password is required" }}
                    error={errors.empPassword}
                  />
                )}
                {!editData && (
                  <FormField
                    type="password"
                    name="empPasswordConfirm"
                    label="Confirm Password"
                    register={register}
                    registerOptions={{
                      required: "Confirm Password is required",
                    }}
                    error={errors.empPasswordConfirm}
                  />
                )}
                <FormField
                  type="text"
                  name="empNumber"
                  label="Mobile Number"
                  register={register}
                  registerOptions={{ required: "Mobile Number is required" }}
                  error={errors.empNumber}
                />
                <FormField
                  type="date"
                  name="empDateOfBirth"
                  label="Date of Birth"
                  register={register}
                  registerOptions={{ required: "Date of Birth is required" }}
                  error={errors.empDateOfBirth}
                />
                <FormField
                  type="select"
                  name="empGender"
                  label="Gender"
                  isRequired
                  register={register}
                  registerOptions={{ required: "Gender is required" }}
                  error={errors.empGender}
                  options={Object.values(Gender)
                    .filter((value) => typeof value === "number")
                    .map((value) => ({
                      value,
                      label: Gender[value as number],
                    }))}
                />
                <FormField
                  type="text"
                  name="empAddress"
                  label="Address"
                  register={register}
                  registerOptions={{ required: "Address is required" }}
                  error={errors.empAddress}
                />
              </div>
            </Tab>

            <Tab title="Job Info" name="job">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  type="text"
                  name="empJobTitle"
                  label="Job Title"
                  register={register}
                  registerOptions={{ required: "Job Title is required" }}
                  error={errors.empJobTitle}
                />
                <FormField
                  type="text"
                  name="empExperience"
                  label="Experience"
                  register={register}
                  registerOptions={{ required: "Experience is required" }}
                  error={errors.empExperience}
                />
                <FormField
                  type="date"
                  name="empDateofJoining"
                  label="Date of Joining"
                  register={register}
                  registerOptions={{ required: "Date of Joining is required" }}
                  error={errors.empDateofJoining}
                />
                <FormField
                  type="select"
                  name="role"
                  label="Role"
                  register={register}
                  registerOptions={{ required: "Role is required" }}
                  error={errors.role}
                  options={Object.values(UserRoles)
                    .filter((value) => typeof value === "number")
                    .map((value) => ({
                      value,
                      label: UserRoles[value as number],
                    }))}
                />
              </div>
            </Tab>

            <Tab title="Salary Info" name="salary">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  type="number"
                  name="basicSalary"
                  label="Basic Salary"
                  register={register}
                  registerOptions={{ required: "Basic Salary is required" }}
                  error={errors.basicSalary}
                />
                <FormField
                  type="number"
                  name="hra"
                  label="HRA"
                  register={register}
                  registerOptions={{ required: "HRA is required" }}
                  error={errors.hra}
                />
                <FormField
                  type="number"
                  name="conveyanceAllowance"
                  label="Conveyance Allowance"
                  register={register}
                  registerOptions={{
                    required: "Conveyance Allowance is required",
                  }}
                  error={errors.conveyanceAllowance}
                />
                <FormField
                  type="number"
                  name="specialAllowance"
                  label="Special Allowance"
                  register={register}
                  registerOptions={{
                    required: "Special Allowance is required",
                  }}
                  error={errors.specialAllowance}
                />
                <FormField
                  type="number"
                  name="otherAllowance"
                  label="Other Allowance"
                  register={register}
                  registerOptions={{ required: "Other Allowance is required" }}
                  error={errors.otherAllowance}
                />
              </div>
            </Tab>

            <Tab title="Bank & PAN Info" name="bank">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  type="text"
                  name="pan"
                  label="PAN Number"
                  register={register}
                  registerOptions={{ required: "PAN is required" }}
                  error={errors.pan}
                />
                <FormField
                  type="text"
                  name="uan"
                  label="UAN Number"
                  register={register}
                  registerOptions={{ required: "UAN is required" }}
                  error={errors.uan}
                />
                <FormField
                  type="text"
                  name="bankAccountNumber"
                  label="Account Number"
                  register={register}
                  registerOptions={{ required: "Account Number is required" }}
                  error={errors.bankAccountNumber}
                />
                <FormField
                  type="text"
                  name="ifscCode"
                  label="IFSC Code"
                  register={register}
                  registerOptions={{ required: "IFSC Code is required" }}
                  error={errors.ifscCode}
                />
                <FormField
                  type="text"
                  name="bankName"
                  label="Bank Name"
                  register={register}
                  registerOptions={{ required: "Bank Name is required" }}
                  error={errors.bankName}
                />
              </div>
              <div className="flex justify-start">
                <Button
                  type="submit"
                  text={isSubmitting ? "Submitting..." : "Submit"}
                  className="bg-[rgb(66,42,213)] text-white mt-10 py-2 px-4 rounded disabled:opacity-50"
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  text="Reset"
                  onClick={() => reset(defaultValues)}
                  className="bg-gray-500 text-white mt-10 py-2 px-4 rounded ml-4"
                />
              </div>
            </Tab>
          </Tabs>{" "}
          {/* ✅ Navigation at the bottom */}
          <div className="w-full grid grid-cols-2 mt-auto pt-6 border-t">
            <div className="flex justify-start">
              {activeTab > 0 && (
                <div className="flex items-center gap-2">
                  <IoMdArrowRoundBack />
                  <button type="button" onClick={prevTab}>
                    Previous
                  </button>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              {activeTab < tabCount - 1 && (
                <div className="flex items-center gap-2">
                  <button type="button" onClick={nextTab}>
                    Next
                  </button>
                  <IoMdArrowRoundForward />
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
