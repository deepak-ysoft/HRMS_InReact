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
                var result = await _employeeLeave.GetEmployeesLeave(empId, page); // Get all employees leave
                return Ok(result);          
            }
            catch (Exception)
            {
                throw;
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
                return Ok(result);
            }
            catch (Exception)
            {
                throw;
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
            catch (Exception)
            {
                throw;
            }
        }
    }
}
