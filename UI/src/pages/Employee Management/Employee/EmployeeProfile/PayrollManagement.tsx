import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FormField } from "../../../../components/FormFieldComponent/FormFieldComponent";
import { GeneratePayrollQuery } from "../../../../services/Employee Management/Payroll/Generate.query";
import { toast } from "react-toastify";
import { GeneratePayrollInputs } from "../../../../types/IPayroll.type";
import { Button } from "../../../../components/ButtonComponent/ButtonComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { BreadCrumbsComponent } from "../../../../components/Breadcrumbs/BreadCrumbsComponents";

const PayrollManagement: React.FC = () => {
  const location = useLocation();
  const empId = location.state.empId as number;

  const [generatingSalary, setGeneratingSalary] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    register: registerGenerate,
    handleSubmit: handleGenerateSubmit,
    reset: resetGenerate,
    watch,
    formState: { errors: generateErrors },
  } = useForm<GeneratePayrollInputs>({
    defaultValues: {
      employeeId: "",
      bonus: 0,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    },
  });
  console.log(empId, "empId in PayrollManagement");
  const onGenerateSalarySubmit = async (data: GeneratePayrollInputs) => {
    setGeneratingSalary(true);

    const formData = new FormData();
    formData.append("employeeId", empId?.toString() || "0");
    formData.append("bonus", data.bonus?.toString() || "0");
    formData.append("month", data.month?.toString() || "");
    formData.append("year", data.year?.toString() || "");

    const response = await GeneratePayrollQuery(formData);
    if (!response.isSuccess) {
      toast.warning(response.message);
      setGeneratingSalary(false);
      return;
    }
    navigate(`/employees/Employee-Details/${empId}`);

    toast.success(
      `Salary for Employee ID ${empId} generated successfully! Net Pay: ₹${response?.data?.netPay?.toFixed(
        2
      )}`
    );
    resetGenerate();
    setGeneratingSalary(false);
  };

  return (
    <>
      <BreadCrumbsComponent />
      <div className="min-h-screen bg-base-200 p-4 font-inter">
        <div className="card w-full max-w-6xl mx-auto shadow-2xl bg-base-100 px-4 sm:px-6 md:px-10 py-8 rounded-box">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-6">
            Payroll Management
          </h2>

          {/* Generate Salary Section */}
          <div className="mb-8 p-4 sm:p-6 bg-base-200 rounded-lg shadow-inner">
            <h3 className="text-xl sm:text-2xl font-semibold text-secondary mb-4">
              Generate Salary
            </h3>
            <form
              onSubmit={handleGenerateSubmit(onGenerateSalarySubmit)}
              className="space-y-4"
            >
              {/* Grid adapts based on screen size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                  name="employeeId"
                  type="hidden"
                  value={watch("employeeId") || 0}
                />
                <FormField
                  type="number"
                  name="bonus"
                  label="Bonus (Optional)"
                  placeholder="e.g., 5000"
                  register={registerGenerate}
                  registerOptions={{
                    valueAsNumber: true,
                    min: { value: 0, message: "Bonus cannot be negative" },
                  }}
                  error={generateErrors.bonus}
                />
                <FormField
                  type="select"
                  name="month"
                  label="Month"
                  register={registerGenerate}
                  registerOptions={{
                    required: "Month is required",
                    valueAsNumber: true,
                  }}
                  error={generateErrors.month}
                  options={[...Array(12)].map((_, i) => ({
                    value: i + 1,
                    label: new Date(0, i).toLocaleString("default", {
                      month: "long",
                    }),
                  }))}
                />
                <FormField
                  type="number"
                  name="year"
                  label="Year"
                  placeholder="e.g., 2023"
                  register={registerGenerate}
                  registerOptions={{
                    required: "Year is required",
                    valueAsNumber: true,
                    min: { value: 2000, message: "Invalid year" },
                    max: { value: 2100, message: "Invalid year" },
                  }}
                  error={generateErrors.year}
                />
              </div>

              {/* Submit Button */}
              <div className="form-control mt-4">
                <Button
                  type="submit"
                  className="btn btn-primary rounded-md w-full sm:w-auto"
                  disabled={generatingSalary}
                  text={generatingSalary ? "Generating..." : "Generate Salary"}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PayrollManagement;
