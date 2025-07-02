export interface GeneratePayrollInputs {
  employeeId: string;
  bonus: number;
  month: number;
  year: number;
}

export interface PayslipSearchInputs {
  employeeId: string;
  month: number;
  year: number;
}

export interface PayrollResponseVM {
  id: number;
  employeeId: number;
  month: number;
  year: number;
  netPay: number;
}
export interface Payroll {
  id: number;
  month: number; // 1 to 12
  year: number;
  basicSalary: number;
  hra: number;
  bonus: number;
  deductions: number;
  netPay: number;
  payslipPath: string;
}
