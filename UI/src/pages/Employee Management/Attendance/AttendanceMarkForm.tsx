import React from "react";
import { useForm } from "react-hook-form";
import { AttendanceMarkInQuery } from "../../../services/Employee Management/Attendance/AttendanceMarkIn.query";
import { AttendanceMarkOutQuery } from "../../../services/Employee Management/Attendance/AttendanceMarkOut.query";
import { toast } from "react-toastify";
import { FormField } from "../../../components/FormFieldComponent/FormFieldComponent";
import { Button } from "../../../components/ButtonComponent/ButtonComponent";
import { AttendanceFormInputs } from "../../../types/IAttendanceFormInputs.type";

interface AttendanceMarkFormProps {
  onSubmit?: (data: AttendanceFormInputs) => void;
  mode?: "mark" | "filter";
}

const AttendanceMarkForm: React.FC<AttendanceMarkFormProps> = ({
  onSubmit,
  mode = "mark",
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AttendanceFormInputs>({
    defaultValues: {
      employeeId: "",
      remarks: "",
    },
  });

  const handleMarkAttendance = async (
    data: AttendanceFormInputs,
    action: "in" | "out"
  ) => {
    const numericEmployeeId = parseInt(data.employeeId);
    if (isNaN(numericEmployeeId)) {
      toast.error("Please enter a valid Employee ID.");
      return;
    }

    let response;
    const formData = new FormData();
    formData.append("employeeId", numericEmployeeId.toString());
    if (action === "in") {
      response = await AttendanceMarkInQuery(formData);
    } else {
      response = await AttendanceMarkOutQuery(formData);
    }

    if (response?.isSuccess) {
      toast.success("Attendance marked successfully.");
    } else {
      toast.error(response?.message || "Failed to mark attendance.");
    }

    reset({
      employeeId: data.employeeId,
      remarks: "",
    });
  };

  const onFormSubmit = (data: AttendanceFormInputs) => {
    if (mode === "filter" && onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <div className="w-full">
      <form className="space-y-4" onSubmit={handleSubmit(onFormSubmit)}>
        <FormField
          type="number"
          name="employeeId"
          label="Employee ID"
          placeholder="e.g., 101"
          register={register}
          registerOptions={{ required: "Employee ID is required" }}
          error={errors.employeeId}
        />

        <FormField
          type="textarea"
          name="remarks"
          label="Remarks (Optional)"
          placeholder="Any notes (e.g., 'Forgot ID card')"
          register={register}
          error={errors.remarks}
        />

        {mode === "mark" ? (
          <div className="form-control mt-6 flex flex-row gap-4">
            <Button
              type="button"
              className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
              onClick={handleSubmit((data) => handleMarkAttendance(data, "in"))}
              disabled={isSubmitting}
              text={isSubmitting ? "Marking In..." : "Mark In"}
            />
            <Button
              type="button"
              className="bg-gray-500 text-white py-2 px-4 rounded"
              onClick={handleSubmit((data) =>
                handleMarkAttendance(data, "out")
              )}
              disabled={isSubmitting}
              text={isSubmitting ? "Marking Out..." : "Mark Out"}
            />
          </div>
        ) : (
          <div className="form-control mt-6">
            <Button
              type="submit"
              className="bg-primary text-white py-2 px-4 rounded"
              disabled={isSubmitting}
              text="Filter History"
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default AttendanceMarkForm;
