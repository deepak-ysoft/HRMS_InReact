using CandidateDetails_API.Model;
using HRMS.ViewModel.Response;

namespace CandidateDetails_API.IServices
{
    public interface IEmployeeLeave
    {
        public Task<dynamic> GetEmployeesLeave(int empId, int page); // Get all employees leave
        public Task<ApiResponse<string>> AddUpdateEmployeeLeave(EmployeeLeave employeeLeave); // Add or update an employee leave
        public Task<ApiResponse<string>> DeleteEmployeeLeave(int id); // Delete an employee leave
    }
}
