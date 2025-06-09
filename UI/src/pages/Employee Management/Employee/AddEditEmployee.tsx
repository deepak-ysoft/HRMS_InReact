import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Employee } from "../../../types/IEmployee.type";
import { FormField } from "../../../components/FormFieldComponent/FormFieldComponent";
import { Button } from "../../../components/ButtonComponent/ButtonComponent";
import { AddEmployeeasync } from "../../../services/Employee Management/Employee/AddEmployee.query";
import { useMutation } from "@tanstack/react-query";
import { BreadCrumbsComponent } from "../../../components/Breadcrumbs/BreadCrumbsComponents";
import { UserRoles } from "../../../types/Enum/UserRoles";
import { EditEmployeeasync } from "../../../services/Employee Management/Employee/EditEmployee.query";
import { Gender } from "../../../types/Enum/Gender";
import { toast } from "react-toastify";

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
    register,
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
      if (data.isSuccess) toast.success(data.message);
      else toast.warning(data.message);
      reset(defaultValues);
      navigate("/employees");
    },
    onError: () => {},
  });
  const { mutate: submitEmployeeEdit } = useMutation({
    mutationFn: (formData: FormData) => EditEmployeeasync(formData),
    onSuccess: (data) => {
      if (data.isSuccess) toast.success(data.message);
      else toast.warning(data.message);
      reset(defaultValues);
      navigate("/employees");
    },
    onError: () => {},
  });

  const onSubmit = (data: Employee) => {
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
          {editData ? "Edit" : "Add"} Employee
        </h2>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="bg-base-100 p-8 rounded-lg shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
          <input name="empId" type="hidden" value={watch("empId") || 0} />
          <FormField
            type="file"
            name="photo"
            label="Photo"
            setValue={setValue}
            registerOptions={{ required: !editData && "Photo is required" }}
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
              registerOptions={{ required: "Confirm Password is required" }}
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
            isRequired={true}
            label="Gender"
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
            type="text"
            name="empAddress"
            label="Address"
            register={register}
            registerOptions={{ required: "Address is required" }}
            error={errors.empAddress}
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
