import { EmployeeLeave } from "../../../types/IEmployeeLeave.types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { AddEditLeave } from "../../../services/Employee Management/EmployeeLeave/AddEditLeave.query";
import { BreadCrumbsComponent } from "../../../components/Breadcrumbs/BreadCrumbsComponents";
import CustomInput from "../../../components/FormFieldComponent/InputComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { LeaveType, LeaveTypeLabels } from "../../../types/Enum/LeaveType";
import { Button } from "../../../components/ButtonComponent/ButtonComponent";
import { LeaveApprovel } from "../../../types/Enum/LeaveApprovel";
import { toast } from "react-toastify";

const defaultValues: Partial<EmployeeLeave> = {
  leaveId: 0,
  leaveFor: "",
  leaveType: undefined,
  startDate: "", // ISO 8601 date string
  endDate: "", // ISO 8601 date string
  empId: 0,
  isDelete: false,
  isApprove: LeaveApprovel.Panding,
};

export const LeaveForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state as Partial<EmployeeLeave> | undefined;
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<EmployeeLeave>({ defaultValues });

  useEffect(() => {
    if (editData) {
      Object.entries(editData).forEach(([key, value]) => {
        setValue(key as keyof EmployeeLeave, value as never);
      });
    }
  }, [editData, setValue]);

  const { mutate: SubmitLeave } = useMutation({
    mutationFn: (formData: FormData) => AddEditLeave(formData),
    onSuccess: (data) => {
      if (data.isSuccess) toast.success(data.message);
      else toast.warning(data.message);
      reset(defaultValues);
      navigate("/Leaves");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const onSubmit = (data: EmployeeLeave) => {
    const userId = localStorage.getItem("UserId");
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null || value !== undefined) {
        if (key === "leaveId") {
          formData.append(key, data.leaveId ? String(data.leaveId) : "0");
        } else if (key === "empId") {
          formData.append(key, userId?.toString() || "0");
        } else {
          formData.append(key, String(value));
        }
      }
    });
    SubmitLeave(formData);
  };
  return (
    <>
      <BreadCrumbsComponent />
      <div className="w-full max-w-2xl p-3">
        <h2 className="text-xl font-semibold">
          {editData ? "Edit" : "Add"} Leave
        </h2>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="bg-base-100 p-8 rounded-lg shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8">
          <input name="leaveId" type="hidden" value={watch("leaveId") || 0} />
          <input name="empId" type="hidden" value={watch("empId") || 0} />
          <CustomInput
            label="Leave For"
            name="leaveFor"
            value={watch("leaveFor") || ""}
            onChange={(e) => setValue("leaveFor", e.target.value)}
            error={errors.leaveFor?.message?.toString()}
            required
          />
          <CustomInput
            label="Start Date"
            name="startDate"
            type="date"
            value={watch("startDate") || ""}
            onChange={(e) => setValue("startDate", e.target.value)}
            error={errors.startDate?.message?.toString()}
            required
          />
          <CustomInput
            label="End Date"
            name="endDate"
            type="date"
            value={watch("endDate") || ""}
            onChange={(e) => setValue("endDate", e.target.value)}
            error={errors.endDate?.message?.toString()}
            required
          />

          <CustomInput
            label="Leave Type"
            name="leaveType"
            type="select"
            value={String(watch("leaveType") ?? "")}
            onChange={(e) => setValue("leaveType", Number(e.target.value))}
            options={Object.values(LeaveType)
              .filter((value) => typeof value === "number")
              .map((value) => ({
                label: LeaveTypeLabels[value as LeaveType],
                value: String(value),
              }))}
            error={errors.leaveType?.message?.toString()}
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
