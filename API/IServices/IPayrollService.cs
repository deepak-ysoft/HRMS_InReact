using HRMS.ViewModel.Request;
using HRMS.ViewModel.Response;

namespace HRMS.IServices
{
    public interface IPayrollService
    {
        Task<ApiResponse<PayrollResponseVM>> GenerateSalary(GeneratePayrollRequestVM generatePayrollDto);
        Task<byte[]> DownloadPayslip(int employeeId, int month, int year);
    }
}
