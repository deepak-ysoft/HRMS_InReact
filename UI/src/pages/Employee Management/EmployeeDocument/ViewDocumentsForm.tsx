import React from "react";
import { useForm } from "react-hook-form";
import { FormField } from "../../../components/FormFieldComponent/FormFieldComponent";

interface Props {
  loading: boolean;
  onView: (employeeId: number) => void;
}

export const ViewDocumentsForm: React.FC<Props> = ({ loading, onView }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<{ employeeId: string }>();
  const watchedEmployeeId = watch("employeeId");

  const onSubmit = (data: { employeeId: string }) => {
    const empId = parseInt(data.employeeId);
    if (!isNaN(empId)) {
      onView(empId);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-control mb-4">
      <FormField
        type="text"
        name="employeeId"
        label="Employee ID to view documents"
        placeholder="e.g., 101"
        register={register}
        registerOptions={{
          required: "Employee ID is required",
          pattern: {
            value: /^\d+$/,
            message: "Employee ID must be numeric",
          },
        }}
        error={errors.employeeId}
      />
      <button
        type="submit"
        className="btn btn-info rounded-md mt-2"
        disabled={
          loading || !watchedEmployeeId || isNaN(parseInt(watchedEmployeeId))
        }
      >
        {loading ? "Loading..." : "View Documents"}
      </button>
    </form>
  );
};
