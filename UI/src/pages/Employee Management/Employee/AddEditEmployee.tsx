import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Employee } from "../../../types/IEmployee.type";
import CustomInput from "../../../components/FormFieldComponent/InputComponent";
import { Button } from "../../../components/ButtonComponent/ButtonComponent";
import { AddEmployeeasync } from "../../../services/Employee Management/Employee/AddEmployee.query";
import { useMutation } from "@tanstack/react-query";
import { BreadCrumbsComponent } from "../../../components/Breadcrumbs/BreadCrumbsComponents";
import { UserRoles } from "../../../types/Enum/UserRoles";
import { EditEmployeeasync } from "../../../services/Employee Management/Employee/EditEmployee.query";
import { Gender } from "../../../types/Enum/Gender";
import { showToast } from "../../../utils/commonCSS/toast";

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
  role: undefined, // Fix: must be UserRoles or undefined
  isActive: true,
  resetToken: "",
  resetTokenExpiration: "",
  resetTokenIsValid: false,
};

export const EmployeeForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state as Partial<Employee> | undefined;
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<Employee>({ defaultValues });

  useEffect(() => {
    if (editData) {
      Object.entries(editData).forEach(([key, value]) => {
        setValue(key as keyof Employee, value as never);
      });
    }
  }, [editData, setValue]);

  const { mutate: submitEmployee } = useMutation({
    mutationFn: (formData: FormData) => AddEmployeeasync(formData),
    onSuccess: (data) => {
      if (data.isSuccess) showToast.success(data.message);
      else showToast.warning(data.message);
      reset(defaultValues);
      navigate("/employees");
    },
    onError: () => {},
  });
  const { mutate: submitEmployeeEdit } = useMutation({
    mutationFn: (formData: FormData) => EditEmployeeasync(formData),
    onSuccess: (data) => {
      if (data.isSuccess) showToast.success(data.message);
      else showToast.warning(data.message);
      reset(defaultValues);
      navigate("/employees");
    },
    onError: () => {},
  });

  const onSubmit = (data: Employee) => {
    // Add validation as needed
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "empId") {
          formData.append(key, data.empId ? String(data.empId) : "0");
        } else if (key === "photo" && value instanceof File) {
          formData.append(key, value, value.name);
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
      <div className="w-full max-w-2xl p-3">
        <h2 className="text-xl font-semibold">
          Employee {editData ? "Edit" : "Add"}
        </h2>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="bg-base-100 p-8 rounded-lg shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
          <input name="empId" type="hidden" value={watch("empId") || 0} />
          <CustomInput
            label="Photo"
            name="photo"
            type="file"
            value={watch("photo") || ""}
            onChange={(e) => {
              const file = (e.target as HTMLInputElement).files?.[0] || null;
              setValue("photo", file);
            }}
            error={errors.photo?.message?.toString()}
          />
          <CustomInput
            label="Name"
            name="empName"
            value={watch("empName") || ""}
            onChange={(e) => setValue("empName", e.target.value)}
            error={errors.empName?.message?.toString()}
            required
          />
          <CustomInput
            label="Email"
            name="empEmail"
            value={watch("empEmail") || ""}
            onChange={(e) => setValue("empEmail", e.target.value)}
            error={errors.empEmail?.message?.toString()}
            required
          />
          {!editData && (
            <CustomInput
              label="Password"
              name="empPassword"
              type="password"
              value={watch("empPassword") || ""}
              onChange={(e) => setValue("empPassword", e.target.value)}
              error={errors.empPassword?.message?.toString()}
              required={!editData}
            />
          )}
          {!editData && (
            <CustomInput
              label="Confirm Password"
              name="empPasswordConfirm"
              type="password"
              value={watch("empPasswordConfirm") || ""}
              onChange={(e) => setValue("empPasswordConfirm", e.target.value)}
              error={errors.empPasswordConfirm?.message?.toString()}
              required={!editData}
            />
          )}
          <CustomInput
            label="Mobile Number"
            name="empNumber"
            value={watch("empNumber") || ""}
            onChange={(e) => setValue("empNumber", e.target.value)}
            error={errors.empNumber?.message?.toString()}
            required
          />
          <CustomInput
            label="Date of Birth"
            name="empDateOfBirth"
            type="date"
            value={watch("empDateOfBirth") || ""}
            onChange={(e) => setValue("empDateOfBirth", e.target.value)}
            error={errors.empDateOfBirth?.message?.toString()}
            required
          />
          <CustomInput
            label="Gender"
            name="empGender"
            type="select"
            value={String(watch("empGender") ?? "")}
            onChange={(e) => setValue("empGender", Number(e.target.value))}
            options={Object.values(Gender)
              .filter((value) => typeof value === "number")
              .map((value) => ({
                label: Gender[value as number],
                value: String(value),
              }))}
            error={errors.empGender?.message?.toString()}
            required
          />
          <CustomInput
            label="Job Title"
            name="empJobTitle"
            value={watch("empJobTitle") || ""}
            onChange={(e) => setValue("empJobTitle", e.target.value)}
            error={errors.empJobTitle?.message?.toString()}
            required
          />
          <CustomInput
            label="Experience"
            name="empExperience"
            value={watch("empExperience") || ""}
            onChange={(e) => setValue("empExperience", e.target.value)}
            error={errors.empExperience?.message?.toString()}
            required
          />
          <CustomInput
            label="Date of Joining"
            name="empDateofJoining"
            type="date"
            value={watch("empDateofJoining") || ""}
            onChange={(e) => setValue("empDateofJoining", e.target.value)}
            error={errors.empDateofJoining?.message?.toString()}
            required
          />
          <CustomInput
            label="Address"
            name="empAddress"
            value={watch("empAddress") || ""}
            onChange={(e) => setValue("empAddress", e.target.value)}
            error={errors.empAddress?.message?.toString()}
            required
          />
          <CustomInput
            label="Role"
            name="Role"
            type="select"
            value={String(watch("role") ?? "")}
            onChange={(e) => setValue("role", Number(e.target.value))}
            options={Object.values(UserRoles)
              .filter((value) => typeof value === "number")
              .map((value) => ({
                label: UserRoles[value as number],
                value: String(value),
              }))}
            error={errors.role?.message?.toString()}
            required
          />
        </div>
        <Button
          type="submit"
          text={isSubmitting ? "Submitting..." : "Submit"}
          className="bg-blue-500 text-white mt-10 py-2 px-4 rounded disabled:opacity-50"
          disabled={isSubmitting}
        />
        <Button
          type="button"
          text="Reset"
          onClick={() => reset(defaultValues)}
          className="bg-gray-500 text-white mt-10 py-2 px-4 rounded ml-4"
        />
      </form>
    </>
  );
};
