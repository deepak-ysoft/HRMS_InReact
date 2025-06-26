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
