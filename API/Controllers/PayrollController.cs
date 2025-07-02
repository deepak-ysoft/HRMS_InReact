using HRMS.IServices;
using HRMS.ViewModel.Request;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PayrollController : ControllerBase
    {
        private readonly IPayrollService _payrollService;

        public PayrollController(IPayrollService payrollService)
        {
            _payrollService = payrollService;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateSalary([FromForm] GeneratePayrollRequestVM generatePayrollDto)
        {
            var result = await _payrollService.GenerateSalary(generatePayrollDto);
            return Ok(result);
        }

        [HttpGet("slip/{employeeId}/{year}/{month}")]
        public async Task<IActionResult> DownloadPayslip(int employeeId, int year, int month)
        {
            var fileBytes = await _payrollService.DownloadPayslip(employeeId, month, year);
            return File(fileBytes, "application/pdf", $"payslip_{employeeId}_{month}_{year}.pdf");
        }


        [HttpGet("Get-payslip")]
        public async Task<IActionResult> GetHistory(int empId = 0, int page = 1, int pageSize = 10, string searchValue = "")
        {
            var data = await _payrollService.GetPayslipAsync(empId, page, pageSize, searchValue);
            return Ok(data);
        }
    }
}
