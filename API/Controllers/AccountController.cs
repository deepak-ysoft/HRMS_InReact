﻿using CandidateDetails_API.IServices;
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
                    return Ok(new
                    {
                        IsSuccess = true,
                        Data = result.Data,
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
        public async Task<IActionResult> ChangePassword([FromBody] ChangePassword model)
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
        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPassRequest request)
        {
            var user = await _employeeservice.GetUserByEmailAsync(request.email);
            if (user == null)
                return BadRequest(new ApiResponse<string> { IsSuccess = false, Message = "Email not found" });

            // Generate reset token (GUID or JWT)
            var resetToken = Guid.NewGuid().ToString();

            // Set the token expiration time (1 hour)
            user.ResetToken = resetToken;
            user.ResetTokenExpiration = DateTime.Now.AddHours(1); // Token expires in 1 hour

            // Save the reset token and expiration time in the database
            await _employeeservice.UpdateUserAsync(user);
            
            // Create the reset link with the token
            //var resetLink = $"http://localhost:4200/reset-password?token={resetToken}";
            var resetLink = $"{request.frontendUrl}/reset-password?token={resetToken}";


            // Send the reset link via email
            var isSend = await _emailservice.SendEmailAsync(request.email, "Reset your password", $"Click <a href='{resetLink}'>here</a> to reset your password.");

            return Ok(new ApiResponse<string> { IsSuccess = true, Message = "Password reset email sent" });
        }

        /// <summary>
        /// ResetPassword with reset token and new password
        /// </summary>
        /// <param name="request"> ResetPassRequest model object</param>
        /// <returns>message</returns>
        [AllowAnonymous]
        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPassRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            // Verify the token and check if it is valid
            var user = await _employeeservice.GetUserByResetTokenAsync(request.Token);
            if (user == null || !user.ResetTokenIsValid)
            {
                return BadRequest(new ApiResponse<string> { IsSuccess = false, Message = "Invalid or expired token." });
            }

            // Reset the password (use proper password hashing)
            var hasher = new PasswordHasher<ResetPassRequest>();
            user.empPassword = hasher.HashPassword(request, request.NewPassword); // Hash the new password

            // Save the updated user data with the new password
            await _employeeservice.UpdateUserAsync(user);

            return Ok(new ApiResponse<string> { IsSuccess = true, Message = "Password reset successfully." });
        }
    }
}
