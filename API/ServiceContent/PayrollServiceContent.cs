using CandidateDetails_API.Model;
using DocumentFormat.OpenXml.Spreadsheet;
using HRMS.IServices;
using HRMS.Model;
using HRMS.ViewModel.Request;
using HRMS.ViewModel.Response;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System.ComponentModel;
using Colors = QuestPDF.Helpers.Colors;
using IContainer = QuestPDF.Infrastructure.IContainer;

namespace HRMS.ServiceContent
{
    public class PayrollServiceContent : IPayrollService
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public PayrollServiceContent(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            QuestPDF.Settings.License = LicenseType.Community;
            _env = env;
        }

        public async Task<ApiResponse<PayrollResponseVM>> GenerateSalary(GeneratePayrollRequestVM dto)
        {
            var payrollExists = await _context.Payrolls
                .AnyAsync(p => p.EmployeeId == dto.EmployeeId && p.Month == dto.Month && p.Year == dto.Year);

            if (payrollExists)
                return new ApiResponse<PayrollResponseVM>
                {
                    IsSuccess = false,
                    Message = "Payroll already generated for this period."
                };

            var employee = await _context.Employees.FindAsync(dto.EmployeeId);
            if (employee == null)
                return new ApiResponse<PayrollResponseVM>
                {
                    IsSuccess = false,
                    Message = "Employee not found."
                };

            var daysInMonth = DateTime.DaysInMonth(dto.Year, dto.Month);
            var absentDays = await _context.Attendances
                .CountAsync(a => a.EmployeeId == dto.EmployeeId &&
                                 a.Date.Month == dto.Month &&
                                 a.Date.Year == dto.Year &&
                                 a.Status == "Absent");

            var perDaySalary = employee.BasicSalary / daysInMonth;
            var totalDeductions = Math.Round(perDaySalary * absentDays, 2);

            var grossSalary = employee.BasicSalary
                               + employee.HRA
                               + employee.ConveyanceAllowance
                               + employee.SpecialAllowance
                               + employee.OtherAllowance
                               + dto.Bonus;

            var netPay = Math.Round(grossSalary - totalDeductions, 2);

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
                PayslipPath = "null"
            };

            _context.Payrolls.Add(newPayroll);
            await _context.SaveChangesAsync();

            return new ApiResponse<PayrollResponseVM>
            {
                IsSuccess = true,
                Message = "Payroll generated successfully.",
                Data = new PayrollResponseVM
                {
                    Id = newPayroll.Id,
                    EmployeeId = newPayroll.EmployeeId,
                    Month = newPayroll.Month,
                    Year = newPayroll.Year,
                    NetPay = newPayroll.NetPay,
                    BasicSalary = newPayroll.BasicSalary,
                    HRA = newPayroll.HRA,
                    Bonus = newPayroll.Bonus,
                    Deductions = newPayroll.Deductions
                }
            };
        }

        public async Task<byte[]> DownloadPayslip(int employeeId, int month, int year)
        {
            var payroll = await _context.Payrolls
                .Include(p => p.Employee)
                .FirstOrDefaultAsync(p => p.EmployeeId == employeeId && p.Month == month && p.Year == year);

            if (payroll == null)
                throw new KeyNotFoundException("Payslip data not found for the selected period.");

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(40);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontFamily("Arial").FontSize(12));


                    page.Header().Element(header =>
                    {
                        var monthName = new DateTime(payroll.Year, payroll.Month, 1).ToString("MMMM");
                        var logoPath = Path.Combine(_env.ContentRootPath, "uploads", "ysoft-Logo.png");

                        header.Row(row =>
                        {
                            // 📷 Left side - Logo
                            if (System.IO.File.Exists(logoPath))
                            {
                                row.ConstantItem(80).Height(60).Image(logoPath, ImageScaling.FitArea);
                            }
                            else
                            {
                                row.ConstantItem(80).Height(60); // Reserve space even if image missing
                            }

                            // 📝 Right side - Company & Payslip Info
                            row.RelativeItem().AlignRight().Column(col =>
                            {
                                col.Item().AlignRight().Text("Salary Slip")
                                    .FontSize(20).Bold().FontColor(Colors.Blue.Medium);

                                col.Item().AlignRight().Text($"Payslip for {monthName} {payroll.Year}")
                                    .FontSize(12).FontColor(Colors.Grey.Darken2);

                                col.Item().AlignRight().Text($"Generated on: {DateTime.Now:dd MMM yyyy}")
                                    .FontSize(10).FontColor(Colors.Grey.Darken3);
                            });
                        });
                    });


                    page.Content().Element(body =>
                    {
                        body.Column(col =>
                        {
                            col.Spacing(15);

                            col.Item().Text("Employee Details").FontSize(14).Bold().FontColor(Colors.Blue.Medium);

                            col.Item().Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.RelativeColumn(1);
                                    columns.RelativeColumn(2);
                                });

                                table.Cell().Element(CellStyle).Text("Name:");
                                table.Cell().Element(CellStyle).Text(payroll.Employee.empName ?? "N/A");
                                table.Cell().Element(CellStyle).Text("Email:");
                                table.Cell().Element(CellStyle).Text(payroll.Employee.empEmail ?? "N/A");
                                table.Cell().Element(CellStyle).Text("Job Title:");
                                table.Cell().Element(CellStyle).Text(payroll.Employee.empJobTitle ?? "N/A");
                                table.Cell().Element(CellStyle).Text("Experience:");
                                table.Cell().Element(CellStyle).Text(payroll.Employee.empExperience ?? "N/A");
                                table.Cell().Element(CellStyle).Text("Date of Joining:");
                                table.Cell().Element(CellStyle).Text(payroll.Employee.empDateofJoining.ToString("dd-MM-yyyy"));
                            });

                            col.Item().PaddingTop(20).Text("Salary Breakdown").FontSize(14).Bold().FontColor(Colors.Green.Medium);

                            col.Item().Table(table =>
                            {
                                table.ColumnsDefinition(c =>
                                {
                                    c.RelativeColumn();
                                    c.RelativeColumn();
                                });

                                table.Header(h =>
                                {
                                    h.Cell().Element(HeaderCellStyle).Text("Component");
                                    h.Cell().Element(HeaderCellStyle).AlignRight().Text("Amount (₹)");
                                });

                                table.Cell().Element(CellStyle).Text("Basic Salary");
                                table.Cell().Element(CellStyle).AlignRight().Text($"{payroll.BasicSalary}");

                                table.Cell().Element(CellStyle).Text("HRA");
                                table.Cell().Element(CellStyle).AlignRight().Text($"{payroll.HRA}");

                                table.Cell().Element(CellStyle).Text("Conveyance Allowance");
                                table.Cell().Element(CellStyle).AlignRight().Text($"{payroll.Employee.ConveyanceAllowance}");

                                table.Cell().Element(CellStyle).Text("Special Allowance");
                                table.Cell().Element(CellStyle).AlignRight().Text($"{payroll.Employee.SpecialAllowance}");

                                table.Cell().Element(CellStyle).Text("Other Allowance");
                                table.Cell().Element(CellStyle).AlignRight().Text($"{payroll.Employee.OtherAllowance}");

                                table.Cell().Element(CellStyle).Text("Bonus");
                                table.Cell().Element(CellStyle).AlignRight().Text($"{payroll.Bonus}");

                                table.Cell().Element(CellStyle).Text("Deductions");
                                table.Cell().Element(CellStyle).AlignRight().Text($"-{payroll.Deductions}");

                                table.Cell().Element(CellStyle).Text("Net Pay");
                                table.Cell().Element(CellStyle).AlignRight().Text($"{payroll.NetPay}").Bold();
                            });

                            col.Item().PaddingTop(20).AlignRight().Text($"Net Salary Payable: {payroll.NetPay}").FontSize(16).Bold().FontColor(Colors.Black);
                        });
                    });

                    page.Footer().AlignCenter().Text(text =>
                    {
                        text.CurrentPageNumber();
                        text.Span(" / ");
                        text.TotalPages();
                    });
                });
            });

            return document.GeneratePdf();
        }

        private static IContainer CellStyle(IContainer container)
        {
            return container
                .PaddingVertical(5)
                .PaddingHorizontal(5)
                .BorderBottom(1)
                .BorderColor(Colors.Grey.Lighten2);
        }

        private static IContainer HeaderCellStyle(IContainer container)
        {
            return container
                .Background(Colors.Grey.Lighten3)
                .PaddingVertical(6)
                .PaddingHorizontal(5)
                .BorderBottom(1)
                .BorderColor(Colors.Grey.Darken1);
        }

        public async Task<ApiResponse<dynamic>> GetPayslipAsync(int empId, int page, int pageSize, string SearchValue)
        {
            var query = _context.Payrolls.Include(x => x.Employee)
           .AsQueryable();

            if (!string.IsNullOrEmpty(SearchValue))
            {
                string searchTerm = SearchValue.ToLower();
                query = query.Where(c =>
                    c.Month.ToString().Contains(searchTerm) ||
                    c.Year.ToString().Contains(searchTerm) ||
                    c.Deductions.ToString().Contains(searchTerm) ||
                    c.NetPay.ToString().Contains(searchTerm) ||
                    c.Bonus.ToString().Contains(searchTerm));
            }

            if (empId > 0)
                query = query.Where(a => a.EmployeeId == empId);

            var totalCount = query.Count();

            var salary = await query
                .Select(a => new PayrollResponseVM // Project directly to DTO
                {
                    Id = a.Id,
                    EmployeeId = a.EmployeeId,
                    Employee = a.Employee.empName,
                    Month = a.Month,
                    Year = a.Year,
                    BasicSalary = a.BasicSalary,
                    HRA = a.HRA,
                    Bonus = a.Bonus,
                    Deductions = a.Deductions,
                    NetPay = a.NetPay
                }).Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new ApiResponse<dynamic>
            {
                IsSuccess = true,
                Message = "Data retrieved successfully.",
                Data = new
                {
                    salary = salary,
                    TotalCount = totalCount
                }
            };
        }
    }
}
