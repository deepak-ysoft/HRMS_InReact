using CandidateDetails_API.IServices;
using CandidateDetails_API.Model;
using CandidateDetails_API.Models;
using HRMS.ViewModel.Response;
using Microsoft.EntityFrameworkCore;

namespace CandidateDetails_API.ServiceContent
{
    public class EmployeeLeaveServiceContent : IEmployeeLeave
    {
        private readonly ApplicationDbContext _context; // Create an instance of the database context
        public EmployeeLeaveServiceContent(ApplicationDbContext context)    // Constructor
        {
            _context = context;
        }

        public async Task<bool> AddUpdateEmployeeLeave(EmployeeLeave employeeLeave) // Add or update an employee leave
        {
            if (employeeLeave.leaveId == 0)
            {
                employeeLeave.isDelete = false;
                employeeLeave.isApprove = ApproveStatus.Panding;
                employeeLeave.startDate = employeeLeave.startDate.AddHours(12);
                employeeLeave.endDate = employeeLeave.endDate.AddHours(12);
                employeeLeave.LeaveType = employeeLeave.LeaveType;
                await _context.employeesleave.AddAsync(employeeLeave); // Add new employee leave

                var employee = await _context.Employees.FindAsync(employeeLeave.empId); // Find the employee
                if (employee == null)
                    return false;

                var calendar = new Calendar(); // Create a new calendar
                calendar.Subject = "Leave for " + employeeLeave.LeaveFor;
                calendar.StartDate = employeeLeave.startDate; // Set the start date
                calendar.EndDate = employeeLeave.endDate; // Set the end date
                calendar.Description = employee.empName + " Leave";// Set the description

                await _context.calendar.AddAsync(calendar); // Add the calendar
                int res = await _context.SaveChangesAsync(); // Save the changes
                if (res > 0)
                {
                    var empLeVM = new EmployeeLeaveVM(); // Create a new employee leave view model
                    empLeVM.calId = calendar.CalId; // Set the calendar ID
                    empLeVM.leaveId = employeeLeave.empId; // Set the employee ID
                    await _context.employeeLeaveVM.AddAsync(empLeVM);
                    return await _context.SaveChangesAsync() > 0;
                }
            }
            else
            {
                //var existingLeave = await _context.employeesleave.FirstOrDefaultAsync(x=>x.leaveId==employeeLeave.leaveId);
                employeeLeave.isDelete = false;
                employeeLeave.isApprove = employeeLeave.isApprove;
                _context.employeesleave.Update(employeeLeave); // Update employee leave

                var empLeave = await _context.employeeLeaveVM.FirstOrDefaultAsync(x => x.leaveId == employeeLeave.empId);

                if (empLeave != null)
                {
                    var cal = await _context.calendar.FirstOrDefaultAsync(x => x.CalId == empLeave.calId);
                    if (cal != null)
                    {
                        cal.StartDate = employeeLeave.startDate; // update the leave start date
                        cal.EndDate = employeeLeave.endDate; // update the leave end date  
                        cal.Subject = "Leave for " + employeeLeave.LeaveFor; // update the leave subject

                        _context.calendar.Update(cal);
                        return await _context.SaveChangesAsync() > 0;
                    }
                }
            }
            return false;
        }

        public async Task<ApiResponse<string>> DeleteEmployeeLeave(int id) // Delete an employee leave
        {
            var leave = _context.employeesleave.Find(id); // Find the employee leave
            if (leave != null) // If the employee leave is found
            {
                leave.isDelete = true;
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
    }
}
