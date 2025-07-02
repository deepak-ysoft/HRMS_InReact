using CandidateDetails_API.Model;
using HRMS.ViewModel.Request;
using HRMS.ViewModel.Response;

namespace CandidateDetails_API.IServices
{
    public interface IEmployee
    {
        public Task<dynamic> GetEmployees(int page, int pageSize, string SearchValue);// Get all employees
        public Task<List<Employee>> GetRequestedEmployees(); // Get all requested employees
        public Task<Employee> GetUserByEmailAsync(string email); // Get user by email
        public Task<ApiResponse<Employee>> AddEmployee(Employee employee); // Add or update an employee
        public Task<ApiResponse<Employee>> UpdateEmployee(EmployeeEditRequestVM employee); // Add or update an employee
        public Task UpdateUserAsync(Employee employee); // Update user
        public Task<dynamic> GetEmployeeById(int id); // Get an employee by id
        public Task<Employee> GetUserByResetTokenAsync(string token); // Get user by reset token
        public Task<ApiResponse<string>> DeleteEmployee(int id); // Delete an employee 
        public Task<dynamic> GetEmployeeAssets( int empId, int page );// Get all assets of an employee
        public Task<bool> AddUpdateEmployeeAssets(EmployeeAssetsResponseVM employeeAsset); // Add and update an asset to an employee
        public Task<bool> DeleteEmployeeAssets(int assetId); // Delete all assets of an employee
    }
}
