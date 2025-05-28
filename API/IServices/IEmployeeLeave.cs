using CandidateDetails_API.Model;
using HRMS.ViewModel.Response;

namespace CandidateDetails_API.IServices
{
    public interface IEmployeeLeave
    {
        public Task<bool> AddUpdateEmployeeLeave(EmployeeLeave employeeLeave); // Add or update an employee leave
        public Task<ApiResponse<string>> DeleteEmployeeLeave(int id); // Delete an employee leave
    }
}
