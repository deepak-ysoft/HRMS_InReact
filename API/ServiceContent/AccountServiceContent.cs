using CandidateDetails_API.IServices;
using CandidateDetails_API.Model;
using HRMS.ViewModel.Response;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CandidateDetails_API.ServiceContent
{
    public class AccountServiceContent : IAccount
    {
        private readonly ApplicationDbContext _context; // Create an instance of the database context
        public AccountServiceContent(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<ApiResponse<string>> ChangePasswordAsync(ChangePassword changePasswordVM) // Change password
        {
            var employee = await _context.Employees.FirstOrDefaultAsync(x => x.empId == changePasswordVM.empId); // Find the employee by ID
            if (employee == null)
                return new ApiResponse<string> { IsSuccess = false, Message = "Employee not found." };

            var hasher = new PasswordHasher<Employee>(); // Create an instance of PasswordHasher
            var passwordVerificationResult = hasher.VerifyHashedPassword(employee, employee.empPassword, changePasswordVM.currentPassword); // To varify user password is correct or not

            if (passwordVerificationResult == PasswordVerificationResult.Success) // If result us success
            {
                employee.empPassword = hasher.HashPassword(employee, changePasswordVM.newPassword); // To convert to encrypted password.
                _context.Employees.Update(employee); // Update the employee
                await _context.SaveChangesAsync();
                return new ApiResponse<string> { IsSuccess = true, Message = "Password changed successfully." };
            }
            else
                return new ApiResponse<string> { IsSuccess = false, Message = "Incorrect current password." };
        }

        // Check user is valid or not
        public async Task<ApiResponse<string>> Login(Login model)
        {
            var hasher = new PasswordHasher<Employee>();
            var emp = await _context.Employees.FirstOrDefaultAsync(u => u.empEmail == model.email);
            if (emp != null)
            {
                var passwordVerificationResult = hasher.VerifyHashedPassword(emp, emp.empPassword, model.password); // To verify password

                if (emp.isActive == false && passwordVerificationResult == PasswordVerificationResult.Success)
                    return new ApiResponse<string>
                    {
                        IsSuccess = false,
                        Message = "Your account is not active.",
                    };
                if (passwordVerificationResult == PasswordVerificationResult.Success)
                    return new ApiResponse<string>
                    {
                        IsSuccess = true,
                        Message = "Login successfully.",
                    };
            }
            return new ApiResponse<string>
            {
                IsSuccess = false,
                Message = "Wrong info.",
            };
        }
    }
}
