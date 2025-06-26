using CandidateDetails_API.Model;
using HRMS.IServices;
using HRMS.Model;
using HRMS.ViewModel.Request;
using HRMS.ViewModel.Response;
using System.ComponentModel;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using Microsoft.EntityFrameworkCore;
using IContainer = QuestPDF.Infrastructure.IContainer;


namespace HRMS.ServiceContent
{
    public class PayrollServiceContent : IPayrollService
    {
        private readonly ApplicationDbContext _context;

        public PayrollServiceContent(ApplicationDbContext context)
        {
            _context = context;
            // IMPORTANT: License QuestPDF for free community use
            QuestPDF.Settings.License = LicenseType.Community;
        }

        public async Task<ApiResponse<PayrollResponseVM>> GenerateSalary(GeneratePayrollRequestVM dto)
        {
            // 1. Validate: Check if payroll for this month already exists
            var payrollExists = await _context.Payrolls
                .AnyAsync(p => p.EmployeeId == dto.EmployeeId && p.Month == dto.Month && p.Year == dto.Year);

            if (payrollExists)
                return new ApiResponse<PayrollResponseVM>
                {
                    IsSuccess = false,
                    Message = "Payroll for this employee and month has already been generated."
                };

            // 2. Get Employee Data
            var employee = await _context.Employees.FindAsync(dto.EmployeeId);
            if (employee == null)
                return new ApiResponse<PayrollResponseVM>
                {
                    IsSuccess = false,
                    Message = "Employee not found."
                };

            // 3. Calculate Deductions (Simplified Logic)
            // This is a simple example. Real-world scenarios involve tax, PF, etc.
            // Here, we deduct salary for days marked as "Absent".
            var daysInMonth = DateTime.DaysInMonth(dto.Year, dto.Month);
            var absentDays = await _context.Attendances
                .CountAsync(a => a.EmployeeId == dto.EmployeeId &&
                                    a.Date.Month == dto.Month &&
                                    a.Date.Year == dto.Year &&
                                    a.Status == "Absent");

            var perDaySalary = employee.BasicSalary / daysInMonth;
            var totalDeductions = Math.Round((decimal)perDaySalary * absentDays, 2);

            // 4. Calculate Net Pay
            var netPay = Math.Round(employee.BasicSalary + employee.HRA + dto.Bonus - totalDeductions, 2);

            // 5. Create and Save Payroll Record
            var newPayroll = new Payroll
            {
                EmployeeId = dto.EmployeeId,
                Month = dto.Month,
                Year = dto.Year,
                BasicSalary = employee.BasicSalary,
                HRA = employee.HRA,
                Bonus = dto.Bonus,
                Deductions = totalDeductions,
                NetPay = netPay,
                PayslipPath = null // Can be set after generating the PDF if you save it to disk
            };

            _context.Payrolls.Add(newPayroll);
            await _context.SaveChangesAsync();

            return new ApiResponse<PayrollResponseVM>
            {
                IsSuccess = true,
                Message = "Payroll for employee is generated.",
                Data = new PayrollResponseVM
                {
                    Id = newPayroll.Id,
                    EmployeeId = newPayroll.EmployeeId,
                    Month = newPayroll.Month,
                    Year = newPayroll.Year,
                    NetPay = newPayroll.NetPay
                }
            };
        }

        public async Task<byte[]> DownloadPayslip(int employeeId, int month, int year)
        {
            var payroll = await _context.Payrolls
                .Include(p => p.Employee) // Eager load employee details
                .FirstOrDefaultAsync(p => p.EmployeeId == employeeId && p.Month == month && p.Year == year);

            if (payroll == null)
            {
                throw new KeyNotFoundException("Payslip data not found for the selected period.");
            }

            // Generate the PDF using QuestPDF
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(50);
                    page.Header().Element(header => ComposeHeader(header, payroll));
                    page.Content().Element(content => ComposeContent(content, payroll));
                    page.Footer().AlignCenter().Text(x =>
                    {
                        x.CurrentPageNumber();
                        x.Span(" / ");
                        x.TotalPages();
                    });
                });
            });

            return document.GeneratePdf();
        }

        // QuestPDF Helper Methods
        private void ComposeHeader(IContainer container, Payroll payroll)
        {
            var monthName = new DateTime(payroll.Year, payroll.Month, 1).ToString("MMMM");
            container.Row(row =>
            {
                row.RelativeItem().Column(column =>
                {
                    column.Item().Text("Your Company Inc.").Bold().FontSize(20);
                    column.Item().Text("Payslip for " + monthName + " " + payroll.Year);
                    column.Item().Text(text =>
                    {
                        text.Span("Employee ID: ").SemiBold();
                        text.Span(payroll.EmployeeId.ToString());
                    });
                    column.Item().Text(text =>
                    {
                        text.Span("Employee Name: ").SemiBold();
                        text.Span(payroll.Employee.empName); // Assuming Employee has a 'Name' property
                    });
                });
            });
        }

        private void ComposeContent(IContainer container, Payroll payroll)
        {
            container.PaddingVertical(40).Column(column =>
            {
                // Table for Earnings and Deductions
                column.Item().Row(row =>
                {
                    // Earnings
                    row.RelativeItem().Border(1).Padding(5).Column(col =>
                    {
                        col.Item().Text("Earnings").Bold();
                        col.Item().Text($"Basic Salary: {payroll.BasicSalary:C}"); // 'C' for currency format
                        col.Item().Text($"House Rent Allowance (HRA): {payroll.HRA:C}");
                        col.Item().Text($"Bonus: {payroll.Bonus:C}");
                        col.Spacing(10);
                        var totalEarnings = payroll.BasicSalary + payroll.HRA + payroll.Bonus;
                        col.Item().Text($"Total Earnings: {totalEarnings:C}").Bold();
                    });

                    row.Spacing(5);

                    // Deductions
                    row.RelativeItem().Border(1).Padding(5).Column(col =>
                    {
                        col.Item().Text("Deductions").Bold();
                        col.Item().Text($"Absent Days Deduction: {payroll.Deductions:C}");
                        col.Spacing(10);
                        col.Item().Text($"Total Deductions: {payroll.Deductions:C}").Bold();
                    });
                });

                // Net Pay
                column.Spacing(20);
                column.Item().AlignRight().Text($"Net Salary Payable: {payroll.NetPay:C}").Bold().FontSize(16);
            });
        }
    }
}
