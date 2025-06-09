using Azure.Core;
using CandidateDetails_API.IServices;
using CandidateDetails_API.Model;
using HRMS.ViewModel.Request;
using HRMS.ViewModel.Response;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CandidateDetails_API.ServiceContent
{
    public class AccountServiceContent : IAccount
    {
        private readonly ApplicationDbContext _context; // Create an instance of the database context
        private readonly IEmailService _emailservice; // Create an instance of the database context
        public AccountServiceContent(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailservice = emailService;
        }
        public async Task<ApiResponse<string>> ChangePasswordAsync(ChangePassword changePasswordVM) // Change password
        {
            var employee = await _context.Employees.FirstOrDefaultAsync(x => x.empId == changePasswordVM.empId); // Find the employee by ID
            if (employee == null)
                return new ApiResponse<string>
                {
                    IsSuccess = false,
                    Message = "Employee not found."
                };

            var hasher = new PasswordHasher<Employee>(); // Create an instance of PasswordHasher
            var passwordVerificationResult = hasher.VerifyHashedPassword(employee, employee.empPassword, changePasswordVM.currentPassword); // To varify user password is correct or not

            if (passwordVerificationResult == PasswordVerificationResult.Success) // If result us success
            {
                employee.empPassword = hasher.HashPassword(employee, changePasswordVM.newPassword); // To convert to encrypted password.
                _context.Employees.Update(employee); // Update the employee
                await _context.SaveChangesAsync();

                await _emailservice.SendEmailAsync(
                    employee.empEmail,
                    "🔐 Password Changed Successfully",
                    $@"
                    <div style='font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif; max-width:600px; margin:auto; padding:25px; background:#ffffff; border-radius:10px; border:1px solid #e0e0e0;'>
                        <div style='text-align:center;'>
                            <h2 style='color:#28a745;'>✅ Password Changed Successfully</h2>
                        </div>

                        <p style='font-size:16px; color:#333;'>Hi <strong>{employee.empName}</strong>,</p>

                        <p style='font-size:15px; color:#555;'>
                            This is a confirmation that your account password has been changed successfully. You can now log in with your new password.
                        </p>

                        <div style='margin:20px 0; padding:15px; background-color:#f8f9fa; border-left:5px solid #28a745; border-radius:4px;'>
                            <p style='margin:0; font-size:15px;'>
                                🔑 <strong>New Password:</strong> <span style='font-weight:bold;'>{changePasswordVM.newPassword}</span>
                            </p>
                        </div>

                        <p style='font-size:14px; color:#777;'>
                            If you did not request this change, please <a href='mailto:support@example.com' style='color:#d9534f;'>contact our support team</a> immediately.
                        </p>

                        <hr style='border:none; border-top:1px solid #ddd; margin:30px 0;' />

                        <p style='font-size:14px; color:#666; text-align:center;'>
                            Thank you,<br />
                            <strong>YSoft Support Team</strong>
                        </p>
                    </div>"
                );

                return new ApiResponse<string>
                {
                    IsSuccess = true,
                    Message = "Password changed successfully. A confirmation email has been sent."
                };
            }
            else
                return new ApiResponse<string>
                {
                    IsSuccess = false,
                    Message = "Incorrect current password."
                };
        }

        // Check user is valid or not
        public async Task<ApiResponse<EmployeeResponseVM>> Login(Login model)
        {
            var hasher = new PasswordHasher<Employee>();

            // Fetch Employee including hashed password
            var employee = await _context.Employees
                .FirstOrDefaultAsync(x => x.empEmail == model.email);

            if (employee == null)
            {
                return new ApiResponse<EmployeeResponseVM>
                {
                    IsSuccess = false,
                    Message = "Employee not found.",
                    Data = null
                };
            }

            // Verify password
            var passwordVerificationResult = hasher.VerifyHashedPassword(employee, employee.empPassword, model.password);

            if (passwordVerificationResult != PasswordVerificationResult.Success)
            {
                return new ApiResponse<EmployeeResponseVM>
                {
                    IsSuccess = false,
                    Message = "Wrong information.",
                    Data = null
                };
            }

            if (employee.isActive == false)
            {
                return new ApiResponse<EmployeeResponseVM>
                {
                    IsSuccess = false,
                    Message = "Your account is not active.",
                    Data = null
                };
            }

            // Map to Response VM
            var empVM = new EmployeeResponseVM
            {
                empId = employee.empId,
                empName = employee.empName,
                empEmail = employee.empEmail,
                empNumber = employee.empNumber,
                empDateOfBirth = employee.empDateOfBirth,
                empGender = employee.empGender.ToString(),
                empJobTitle = employee.empJobTitle,
                empExperience = employee.empExperience,
                empDateofJoining = employee.empDateofJoining,
                empAddress = employee.empAddress,
                ImagePath = employee.ImagePath,
                Role = employee.Role.ToString(),
                isActive = employee.isActive
            };

            return new ApiResponse<EmployeeResponseVM>
            {
                IsSuccess = true,
                Message = "Login successfully.",
                Data = empVM
            };
        }
    }
}
