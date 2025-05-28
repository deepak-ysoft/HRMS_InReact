using CandidateDetails_API.IServices;
using CandidateDetails_API.Model;
using HRMS.ViewModel.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace CandidateDetails_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EmployeesLeaveController : ControllerBase
    {
        private readonly IEmployeeLeave _employeeLeave; // Create an instance of the employee leave service
        private readonly ApplicationDbContext _context; // Create an instance of the database context
        public EmployeesLeaveController(IEmployeeLeave employeeLeave, ApplicationDbContext context)
        {
            _employeeLeave = employeeLeave;
            _context = context;
        }

        /// <summary>
        ///  Get all employees leave
        /// </summary>
        /// <returns>List of employee leave</returns>
        [HttpGet("GetEmployeesLeave")]
        public async Task<IActionResult> GetEmployeesLeave(int empId, int page = 1)
        {
            try
            {
                // Define the SQL output parameter
                var totalRecordsParam = new SqlParameter("@TotalRecords", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                // Define SQL parameters for the stored procedure
                var parameters = new[]
                {
                    new SqlParameter("@empId", SqlDbType.Int) { Value = empId },
                    new SqlParameter("@PageNumber", SqlDbType.Int) { Value = page },
                    totalRecordsParam
                };

                // Call the stored procedure using FromSqlRaw
                var leaves = await _context.employeesleave
                    .FromSqlRaw("EXEC usp_GetAllEmployeeLeave @empId, @PageNumber, @TotalRecords OUT", parameters)
                    .ToListAsync();

                var list = leaves.Select(x => new LeaveResponseVM
                {
                    leaveId = x.leaveId,
                    LeaveFor = x.LeaveFor,
                    LeaveType = x.LeaveType.ToString(),
                    startDate = x.startDate,
                    endDate = x.endDate,
                    isApprove = x.isApprove.ToString()
                }).ToList();

                var leaveRequests = await _context.employeesleave
                    .FromSqlRaw("EXEC usp_GetAllEmployeeLeaveRequests")
                    .ToListAsync();

                var requestList = leaveRequests.Select(x => new LeaveResponseVM
                {
                    leaveId = x.leaveId,
                    LeaveFor = x.LeaveFor,
                    LeaveType = x.LeaveType.ToString(),
                    startDate = x.startDate,
                    endDate = x.endDate,
                    isApprove = x.isApprove.ToString()
                }).ToList();

                int totalRecords = (int)totalRecordsParam.Value;
                return Ok(new { IsSuccess = true, Data = list, reqLeave = requestList, totalCount = totalRecords });
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        ///   Add or update an employee leave
        /// </summary>
        /// <param name="employeeLeave">Model object</param>
        /// <returns>true if success</returns>
        [HttpPost("AddUpdateEmployeeLeave")]
        public async Task<IActionResult> AddUpdateEmployeeLeave([FromForm] EmployeeLeave employeeLeave)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState); // Return bad request if the model state is invalid

            try
            {
                var result = await _employeeLeave.AddUpdateEmployeeLeave(employeeLeave); // Add or update an employee leave
                if (!result)
                    return Ok(new ApiResponse<string>
                    {
                        IsSuccess = false,
                        Message = "Failed to save data."
                    });

                return Ok(new ApiResponse<string>
                {
                    IsSuccess = true,
                    Message = "Data Saved Successfully."
                });
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Delete an employee leave
        /// </summary>
        /// <param name="id">Leave id </param>
        /// <returns>true if delete</returns>
        [Authorize(Roles = "Admin,HR")]
        [HttpDelete("DeleteEmployeeLeave/{leaveId}")]
        public async Task<IActionResult> DeleteEmployeeLeave(int leaveId)
        {
            try
            {
                var result = await _employeeLeave.DeleteEmployeeLeave(leaveId); // Delete an employee leave
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
