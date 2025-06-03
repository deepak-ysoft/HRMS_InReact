using CandidateDetails_API.IServices;
using CandidateDetails_API.Model;
using CandidateDetails_API.Models;
using HRMS.Model;
using HRMS.ViewModel.Response;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace CandidateDetails_API.ServiceContent
{
    public class EmployeeLeaveServiceContent : IEmployeeLeave
    {
        private readonly ApplicationDbContext _context; // Create an instance of the database context
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly int _currentUserId; // Current user ID
        public EmployeeLeaveServiceContent(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)    // Constructor
        {
            _context = context; _httpContextAccessor = httpContextAccessor;

            var user = _httpContextAccessor.HttpContext?.User;
            _currentUserId = Convert.ToInt32(user?.FindFirst("empId")?.Value);
        }


        public async Task<ApiResponse<string>> AddUpdateEmployeeLeave(EmployeeLeave employeeLeave) // Add or update an employee leave
        {
            var employee = await _context.Employees.FindAsync(employeeLeave.empId); // Find the employee
            if (employee == null)
                return new ApiResponse<string>
                {
                    IsSuccess = false,
                    Message = "Employee not found."
                };

            if (employeeLeave.leaveId == 0)
            {
                employeeLeave.CreatedBy = _currentUserId; // Set the created by field
                employeeLeave.UpdatedBy = _currentUserId; // Set the created by field
                employeeLeave.isApprove = ApproveStatus.Panding;
                employeeLeave.startDate = employeeLeave.startDate.AddHours(12);
                employeeLeave.endDate = employeeLeave.endDate.AddHours(12);
                employeeLeave.LeaveType = employeeLeave.LeaveType;
                await _context.employeesleave.AddAsync(employeeLeave); // Add new employee leave



                var calendar = new Calendar(); // Create a new calendar
                calendar.Title = CalendarTitle.Leave;
                calendar.Start = employeeLeave.startDate; // Set the start date
                calendar.End = employeeLeave.endDate; // Set the end date
                calendar.Description = employee.empName + "on Leave, " + employeeLeave.LeaveFor + ", " + employeeLeave.LeaveType;// Set the description

                await _context.calendar.AddAsync(calendar); // Add the calendar
                int res = await _context.SaveChangesAsync(); // Save the changes
                if (res > 0)
                {
                    var empLeVM = new EmployeeLeaveVM(); // Create a new employee leave view model
                    empLeVM.calId = calendar.CalId; // Set the calendar ID
                    empLeVM.leaveId = employeeLeave.empId; // Set the employee ID
                    await _context.employeeLeaveVM.AddAsync(empLeVM);
                }
            }
            else
            {
                //var existingLeave = await _context.employeesleave.FirstOrDefaultAsync(x=>x.leaveId==employeeLeave.leaveId);
                employeeLeave.isApprove = employeeLeave.isApprove;
                employeeLeave.UpdatedBy = _currentUserId; // Set the updated by field
                employeeLeave.UpdatedAt = DateTime.Now; // Set the updated at field
                _context.employeesleave.Update(employeeLeave); // Update employee leave

                var empLeave = await _context.employeeLeaveVM.FirstOrDefaultAsync(x => x.leaveId == employeeLeave.empId);

                if (empLeave != null)
                {
                    var cal = await _context.calendar.FirstOrDefaultAsync(x => x.CalId == empLeave.calId);
                    if (cal != null)
                    {
                        cal.Start = employeeLeave.startDate; // update the leave start date
                        cal.End = employeeLeave.endDate; // update the leave end date  
                        cal.Title = CalendarTitle.Leave; // update the leave subject
                        cal.Description = employee.empName + "on Leave, " + employeeLeave.LeaveFor + ", " + employeeLeave.LeaveType; // update the leave description

                        _context.calendar.Update(cal);
                    }
                }
            }

            await _context.SaveChangesAsync(); // Save the changes
            return new ApiResponse<string>
            {
                IsSuccess = true,
                Message = "Data Saved Successfully."
            };
        }

        public async Task<ApiResponse<string>> DeleteEmployeeLeave(int id) // Delete an employee leave
        {
            var leave = _context.employeesleave.Find(id); // Find the employee leave
            if (leave != null) // If the employee leave is found
            {
                leave.IsDeleted = true;
                _context.employeesleave.Update(leave); // Remove the employee leave
                int result = await _context.SaveChangesAsync();
                if (result == 0)
                    return new ApiResponse<string>
                    {
                        IsSuccess = false,
                        Message = "Failed to Delete data."
                    };
            }
            return new ApiResponse<string>
            {
                IsSuccess = true,
                Message = "Data Deleted Successfully."
            };
        }

        public async Task<dynamic> GetEmployeesLeave(int empId, int page)
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
            return new { IsSuccess = true, Message = "Employee Leave Retrieved.", Data = list, reqLeave = requestList, totalCount = totalRecords };
        }
    }
}
