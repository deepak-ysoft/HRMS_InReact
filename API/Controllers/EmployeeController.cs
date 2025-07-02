using CandidateDetails_API.IServices;
using CandidateDetails_API.Model;
using HRMS.ViewModel.Request;
using HRMS.ViewModel.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CandidateDetails_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployee _service; // Create an instance of the service
        private readonly ApplicationDbContext _context;  // Create an instance of the database context
        public EmployeeController(IEmployee service, ApplicationDbContext context)
        {
            _service = service;
            _context = context;
        }

        /// <summary>
        ///   Get all employees
        /// </summary>
        /// <returns>Employee list</returns>
        [Authorize(Roles = "Admin,HR")]
        [HttpGet("GetEmployees")]
        public async Task<IActionResult> Employees(int page = 1, int pageSize = 10, string SearchValue = "")
        {
            try
            {
                var employees = await _service.GetEmployees(page, pageSize, SearchValue); // Get all employees
                var requestedEmployees = await _service.GetRequestedEmployees(); // Get all requested employees
                int requestedEmpCount = requestedEmployees.Count();
                return Ok(new { IsSuccess = true, res = employees, requestres = requestedEmployees, reqEmpCount = requestedEmpCount });
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        ///   Add an employee
        /// </summary>
        /// <param name="employee"> Employee model object</param>
        /// <returns>true if add or update success</returns>
        [AllowAnonymous]
        [HttpPost("AddEmployee")]
        public async Task<IActionResult> AddEmployee([FromForm] Employee employee)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                var emailExists = await _context.Employees.AnyAsync(u => u.empEmail.ToLower() == employee.empEmail.ToLower()); // To check duplicate emails.
                if (emailExists)
                {
                    return Ok(new ApiResponse<string> { IsSuccess = false, Message = "Duplicate Email" });
                }
                var result = await _service.AddEmployee(employee); // Add or update an employee

                return Ok(result);
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        ///   Add an employee
        /// </summary>
        /// <param name="employee"> Employee model object</param>
        /// <returns>true if add or update success</returns>
        [Authorize]
        [HttpPost("UpdateEmployee")]
        public async Task<IActionResult> UpdateEmployee([FromForm] EmployeeEditRequestVM employee)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var result = await _service.UpdateEmployee(employee); // Add or update an employee
                //var employeeData = await _service.GetEmployeeById(employee.empId);
                return Ok(result);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpGet("GetEmployeeById/{empId}")]
        public async Task<IActionResult> GetEmployeeById(int empId)
        {
            try
            {
                var data = await _service.GetEmployeeById(empId); // Get an employee by ID
                if (data.employee != null)
                    return Ok(
                        new ApiResponse<dynamic>
                        {
                            IsSuccess = true,
                            Message = "Employee Details Retrieved.",
                            Data = data
                        });

                return Ok(new ApiResponse<ApiResponse<dynamic>> { IsSuccess = true, Message = "Employee not found" });
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        ///  Delete an employee
        /// </summary>
        /// <param name="empId">Employee id</param>
        /// <returns>true if delete is success</returns>
        [Authorize(Roles = "Admin,HR")]
        [HttpDelete("DeleteEmployee/{empId}")]
        public async Task<IActionResult> DeleteEmployee(int empId)
        {
            try
            {
                var result = await _service.DeleteEmployee(empId); // Delete an employee
                return Ok(result);
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Get all assets of an employee
        /// </summary>
        /// <returns>Assets list</returns>
        [HttpGet("GetEmployeeAssets")]
        public async Task<IActionResult> GetEmployeeAssets(int empId, int page = 1)
        {
            try
            {
                var assets = await _service.GetEmployeeAssets(empId, page); // This should return IQueryable or IEnumerable
                return Ok(new { IsSuccess = true, Data = assets.pagedAssets, Message = "Employee Details Retrieved.", totalCount = assets.totalCount });
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        ///  To add and update an asset to an employee
        /// </summary>
        /// <param name="employeeAsset"> EmployeeAsset model object</param>
        /// <returns>Return tru if success</returns>
        [HttpPost("AddUpdateEmployeeAssets")]
        public async Task<IActionResult> AddUpdateEmployeeAssets([FromForm] EmployeeAssetsResponseVM employeeAsset)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _service.AddUpdateEmployeeAssets(employeeAsset); // Add and update an asset to an employee
                if (result)
                {
                    return Ok(new ApiResponse<string> { IsSuccess = true, Message = "Asset added/updated successfully" });
                }
                return Ok(new ApiResponse<string> { IsSuccess = false, Message = "Failed to add asset" });
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Delete assets of an employee
        /// </summary>
        /// <param name="assetId">Assets id</param>
        /// <returns>Return tru if success</returns>
        [HttpDelete("DeleteEmployeeAssets/{assetId}")]
        public async Task<IActionResult> DeleteEmployeeAssets(int assetId)
        {
            try
            {
                var result = await _service.DeleteEmployeeAssets(assetId); // Delete all assets of an employee
                if (result)
                {
                    return Ok(new ApiResponse<string> { IsSuccess = true, Message = "Asset deleted successfully" });
                }
                return Ok(new ApiResponse<string> { IsSuccess = false, Message = "Failed to delete asset" });
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
