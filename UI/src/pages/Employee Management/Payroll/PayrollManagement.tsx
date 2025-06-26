import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FormField } from "../../../components/FormFieldComponent/FormFieldComponent";
import { GeneratePayrollQuery } from "../../../services/Employee Management/Payroll/Generate.query";
import { GetPayrollSlipQuery } from "../../../services/Employee Management/Payroll/GetSlip.query";
import { toast } from "react-toastify";
import {
  GeneratePayrollInputs,
  PayrollResponseVM,
  PayslipSearchInputs,
} from "../../../types/IPayroll.type";
import { Button } from "../../../components/ButtonComponent/ButtonComponent";

const PayrollManagement: React.FC = () => {
  const [payrollRecords, setPayrollRecords] = useState<PayrollResponseVM[]>([]);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [generatingSalary, setGeneratingSalary] = useState<boolean>(false);

  // Generate Salary Form
  const {
    register: registerGenerate,
    handleSubmit: handleGenerateSubmit,
    reset: resetGenerate,
    formState: { errors: generateErrors },
  } = useForm<GeneratePayrollInputs>({
    defaultValues: {
      employeeId: "",
      bonus: 0,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    },
  });

  // Search Payslip Form
  const {
    register: registerSearch,
    handleSubmit: handleSearchSubmit,
    formState: { errors: searchErrors },
  } = useForm<PayslipSearchInputs>({
    defaultValues: {
      employeeId: "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    },
  });

  // Generate Salary Handler
  const onGenerateSalarySubmit = async (data: GeneratePayrollInputs) => {
    setGeneratingSalary(true);

    const numericEmployeeId = parseInt(data.employeeId);
    if (isNaN(numericEmployeeId)) {
      toast.error("Employee ID must be a valid number.");
      setGeneratingSalary(false);
      return;
    }

    const formData = new FormData();
    formData.append("employeeId", numericEmployeeId.toString());
    formData.append("bonus", data.bonus.toString());
    formData.append("month", data.month.toString());
    formData.append("year", data.year.toString());

    const response = await GeneratePayrollQuery(formData);

    toast.success(
      `Salary for Employee ID ${numericEmployeeId} generated successfully! Net Pay: $${response.netPay?.toFixed(
        2
      )}`
    );
    resetGenerate();

    // Optionally, refresh payroll records
    setPayrollRecords((prev) => [
      ...prev,
      {
        id: response.id,
        employeeId: response.employeeId,
        month: response.month,
        year: response.year,
        netPay: response.netPay,
      },
    ]);
  };

  // Search Payslip Handler
  const onSearchPayslipSubmit = async (data: PayslipSearchInputs) => {
    setLoadingSearch(true);

    const numericEmployeeId = parseInt(data.employeeId);
    if (isNaN(numericEmployeeId)) {
      toast.error("Employee ID must be a valid number.");
      setLoadingSearch(false);
      return;
    }

    const response = await GetPayrollSlipQuery(
      numericEmployeeId,
      data.month,
      data.year
    );

    // If your API returns an array of records:
    setPayrollRecords(Array.isArray(response) ? response : [response]);

    if (response && (Array.isArray(response) ? response.length > 0 : true)) {
      toast.success(
        `Payslip record found for employee ID: ${numericEmployeeId} for ${data.month}/${data.year}`
      );
    } else {
      toast.info(
        `No payslip record found for employee ID: ${numericEmployeeId} for ${data.month}/${data.year}`
      );
    }
  };

  // Download Payslip Handler
  const handleDownloadPayslip = async (
    employeeId: number,
    month: number,
    year: number
  ) => {
    const response = await GetPayrollSlipQuery(employeeId, month, year);

    // If response is a Blob or file URL, handle accordingly
    // Here, assuming response is a Blob:
    const blob = new Blob([response], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `payslip_EMP${employeeId}_${month
        .toString()
        .padStart(2, "0")}_${year}.pdf`
    );
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success(`Downloading payslip for ${month}/${year}...`);
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 font-inter">
      <div className="card w-full max-w-5xl mx-auto shadow-2xl bg-base-100 p-8 rounded-box">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">
          Payroll Management
        </h2>

        {/* Generate Salary Form */}
        <div className="mb-8 p-6 bg-base-200 rounded-lg shadow-inner">
          <h3 className="text-2xl font-semibold text-secondary mb-4">
            Generate Salary
          </h3>
          <form
            onSubmit={handleGenerateSubmit(onGenerateSalarySubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField
                type="text"
                name="employeeId"
                label="Employee ID"
                placeholder="e.g., 101"
                register={registerGenerate}
                registerOptions={{
                  required: "Employee ID is required",
                  pattern: {
                    value: /^\d+$/,
                    message: "Employee ID must be numeric",
                  },
                }}
                error={generateErrors.employeeId}
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
            <div className="form-control mt-4">
              <Button
                type="submit"
                className="btn btn-primary rounded-md btn-block"
                disabled={generatingSalary}
                text={generatingSalary ? "Generating..." : "Generate Salary"}
              />
            </div>
          </form>
        </div>

        {/* Search Payslips and Download */}
        <div className="mb-8 p-6 bg-base-200 rounded-lg shadow-inner">
          <h3 className="text-2xl font-semibold text-secondary mb-4">
            Search & Download Payslips
          </h3>
          <form
            onSubmit={handleSearchSubmit(onSearchPayslipSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                type="text"
                name="employeeId"
                label="Employee ID"
                placeholder="e.g., 101"
                register={registerSearch}
                registerOptions={{
                  required: "Employee ID is required",
                  pattern: {
                    value: /^\d+$/,
                    message: "Employee ID must be numeric",
                  },
                }}
                error={searchErrors.employeeId}
              />
              <FormField
                type="select"
                name="month"
                label="Month"
                register={registerSearch}
                registerOptions={{
                  required: "Month is required",
                  valueAsNumber: true,
                }}
                error={searchErrors.month}
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
                register={registerSearch}
                registerOptions={{
                  required: "Year is required",
                  valueAsNumber: true,
                  min: { value: 2000, message: "Invalid year" },
                  max: { value: 2100, message: "Invalid year" },
                }}
                error={searchErrors.year}
              />
            </div>
            <div className="form-control mt-4">
              <Button
                type="submit"
                className="btn btn-secondary rounded-md btn-block"
                disabled={loadingSearch}
                text={loadingSearch ? "Searching..." : "Search Payslip"}
              />
            </div>
          </form>
        </div>

        {/* Payroll Records Table */}
        {loadingSearch ? (
          <div className="flex justify-center items-center h-48">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : payrollRecords.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="table w-full">
              <thead>
                <tr className="bg-primary text-primary-content">
                  <th>ID</th>
                  <th>Employee ID</th>
                  <th>Month</th>
                  <th>Year</th>
                  <th>Net Pay</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payrollRecords.map((record) => (
                  <tr
                    key={`${record.employeeId}-${record.month}-${record.year}`}
                    className="hover:bg-base-200"
                  >
                    <td>{record.id}</td>
                    <td>{record.employeeId}</td>
                    <td>
                      {new Date(record.year, record.month - 1).toLocaleString(
                        "default",
                        { month: "long" }
                      )}
                    </td>
                    <td>{record.year}</td>
                    <td>
                      <span className="font-bold text-success">
                        ${record.netPay.toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline btn-info rounded-md"
                        onClick={() =>
                          handleDownloadPayslip(
                            record.employeeId,
                            record.month,
                            record.year
                          )
                        }
                      >
                        Download Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-lg text-gray-500 mt-8">
            No payroll records found for the selected criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollManagement;
