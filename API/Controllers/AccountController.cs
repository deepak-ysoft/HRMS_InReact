using Azure.Core;
using CandidateDetails_API.IServices;
using CandidateDetails_API.Model;
using CandidateDetails_API.ServiceContent;
using HRMS.ViewModel.Request;
using HRMS.ViewModel.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CandidateDetails_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAuthService _authService; // Create an instance of the AuthService
        private readonly IAccount _service; // Create an instance of the service
        private readonly ApplicationDbContext _context; // Create an instance of the database context
        private readonly IEmailService _emailservice; // Create an instance of the database context
        private readonly IEmployee _employeeservice; // Create an instance of the database context

        public AccountController(IAuthService authService, IAccount service, ApplicationDbContext context, IEmailService emailservice, IEmployee employeeservice)
        {
            _authService = authService;
            _service = service;
            _context = context;
            _emailservice = emailservice;
            _employeeservice = employeeservice;
        }

        /// <summary>
        /// To login employee
        /// </summary>
        /// <param name="model">login model</param>
        /// <returns>if login success then return logged employee data,Employee job and login token.</returns>
        /// 
        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] Login model)
        {
            try
            {
                var result = await _service.Login(model); // Assuming Login is now async
                if (result.IsSuccess)
                {

                    var token = _authService.GenerateJwtToken(result.Data, result.Data.Role.ToString()); // GenerateJwtToken returns a token
                    var data = new
                    {
                        empId = result.Data.empId,
                        role = result.Data.Role
                    };

                    return Ok(new
                    {
                        IsSuccess = true,
                        Data = data,
                        Message = "Login Succassfully.",
                        token = token
                    }); // Login returns a result with Success property
                }
                else
                    return BadRequest(result);
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// ChangePassword in Database Table.
        /// </summary>
        /// <param name="empObj">Employee class object with properties value.</param>
        /// <returns></returns>
        [Authorize]
        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromForm] ChangePassword model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _service.ChangePasswordAsync(model); // Assuming ChangePassword is now async

                return Ok(result); // Assuming ChangePassword returns a result with IsSuccess property
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Forgot password using mail
        /// </summary>
        /// <param name="request"> mail id</param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromForm] ForgotPassRequest request)
        {
            var user = await _employeeservice.GetUserByEmailAsync(request.email);
            if (user == null)
            {
                return BadRequest(new ApiResponse<string>
                {
                    IsSuccess = false,
                    Message = "Email not found."
                });
            }

            // Generate a secure reset token and expiry
            var resetToken = Guid.NewGuid().ToString();
            user.ResetToken = resetToken;
            user.ResetTokenExpiration = DateTime.Now.AddHours(1);
            await _employeeservice.UpdateUserAsync(user);

            // Construct the password reset link
            var resetLink = $"{request.frontendUrl}reset-password?token={resetToken}";

            // Prepare the email body
            var emailBody = $@"
            <div style='font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif; max-width:600px; margin:auto; padding:25px; background:#fdfdfd; border-radius:10px; border:1px solid #e0e0e0;'>
                <div style='text-align:center;'>
                    <h2 style='color:#007BFF;'>🔐 Reset Your Password</h2>
                </div>
    
                <p style='font-size:16px; color:#333;'>Hi <strong>{user.empName}</strong>,</p>

                <p style='font-size:15px; color:#555;'>
                    We received a request to reset your account password. Click the button below to set a new password.
                </p>

                <div style='text-align:center; margin:30px 0;'>
                    <a href='{resetLink}' style='display:inline-block; padding:12px 24px; background-color:#007BFF; color:#ffffff; font-weight:500; text-decoration:none; border-radius:6px;'>
                        🔄 Reset Password
                    </a>
                </div>

                <p style='font-size:14px; color:#777;'>
                    If the button above doesn't work, copy and paste the following link into your browser:
                </p>

                <p style='word-break:break-all; font-size:13px; color:#555; background:#f8f9fa; padding:10px; border-radius:5px; border:1px solid #ccc;'>
                    {resetLink}
                </p>

                <p style='font-size:13px; color:#999; margin-top:20px;'>
                    ⏳ This link will expire in <strong>1 hour</strong> for your account security.
                </p>

                <hr style='border:none; border-top:1px solid #e0e0e0; margin:30px 0;' />

                <p style='font-size:14px; color:#666; text-align:center;'>
                    Thank you,<br />
                    <strong>YSoft Support Team</strong>
                </p>
            </div>";

            // Send the email
            var isSent = await _emailservice.SendEmailAsync(request.email, "Reset your password", emailBody);

            if (isSent)
            {
                return Ok(new ApiResponse<string>
                {
                    IsSuccess = true,
                    Message = "Password reset email sent successfully."
                });
            }

            return StatusCode(500, new ApiResponse<string>
            {
                IsSuccess = false,
                Message = "Failed to send the reset email. Please try again later."
            });
        }


        /// <summary>
        /// ResetPassword with reset token and new password
        /// </summary>
        /// <param name="request"> ResetPassRequest model object</param>
        /// <returns>message</returns>
        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromForm] ResetPassRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<string>
                {
                    IsSuccess = false,
                    Message = "Invalid input."
                });
            }

            // Retrieve user by reset token
            var user = await _employeeservice.GetUserByResetTokenAsync(request.Token);
            if (user == null || user.ResetTokenExpiration < DateTime.Now)
            {
                return BadRequest(new ApiResponse<string>
                {
                    IsSuccess = false,
                    Message = "The reset token is invalid or has expired."
                });
            }

            // Hash and update the password securely
            var hasher = new PasswordHasher<object>();
            user.empPassword = hasher.HashPassword(null, request.NewPassword);

            // Clear the reset token and expiration
            user.ResetToken = null;
            user.ResetTokenExpiration = null;

            // Save changes
            await _employeeservice.UpdateUserAsync(user);

            // Prepare confirmation email
            var emailBody = $@"
            <div style='font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif; max-width:600px; margin:auto; padding:20px; background:#f9f9f9; border-radius:10px; border:1px solid #ddd;'>
                <div style='text-align:center;'>
                    <h2 style='color:#2c3e50;'>🔒 Password Reset Successful</h2>
                </div>
                <p style='font-size:16px; color:#333;'>Hi <strong>{user.empName}</strong>,</p>

                <p style='font-size:15px; color:#555;'>
                    Your password has been <strong>successfully reset</strong>. You can now log in using your new credentials.
                </p>

                <div style='padding:15px; background-color:#eaf7ea; border-left:5px solid #28a745; margin:20px 0;'>
                    <p style='margin:0; font-size:15px; color:#2e7d32;'>
                        ✅ <strong>New Password:</strong> <span style='font-weight:bold;'>{request.NewPassword}</span>
                    </p>
                </div>

                <p style='font-size:14px; color:#777;'>
                    If you did not request this change, please <a href='mailto:support@example.com' style='color:#d9534f;'>contact our support team</a> immediately.
                </p>

                <hr style='border:none; border-top:1px solid #ccc; margin:30px 0;' />

                <p style='font-size:14px; color:#999; text-align:center;'>
                    Thank you,<br />
                    <strong>YSoft Support Team</strong>
                </p>
            </div>";

            // Send confirmation email
            await _emailservice.SendEmailAsync(user.empEmail, "Password Reset Confirmation", emailBody);

            return Ok(new ApiResponse<string>
            {
                IsSuccess = true,
                Message = "Your password has been reset successfully. A confirmation email has been sent."
            });
        }

        [HttpPost("verify-phone")]
        public async Task<IActionResult> VerifyPhone([FromBody] PhoneVerifyRequest model)
        {
            if (string.IsNullOrWhiteSpace(model.PhoneNumber))
                return BadRequest("Phone number is required.");

            var user = await _context.Employees.FirstOrDefaultAsync(x => x.empNumber == model.PhoneNumber);
            if (user == null)
                return NotFound("Phone number not registered.");

            // Your logic to send password reset token/email/sms here

            return Ok(new { success = true, message = "Phone verified, proceed with password reset." });
        }
    }
}
