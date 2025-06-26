using CandidateDetails_API.Model;
using HRMS.IServices;
using HRMS.Model;
using HRMS.ViewModel.Request;
using HRMS.ViewModel.Response;
using Microsoft.EntityFrameworkCore;
using System.Buffers;

namespace HRMS.ServiceContent
{
    public class AttendanceServiceContent : IAttendanceService
    {
        private readonly ApplicationDbContext _context;

        // Inject your DbContext
        public AttendanceServiceContent(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<AttendanceResponseVM>> MarkIn(MarkAttendanceRequestVM markAttendanceDto)
        {
            var today = markAttendanceDto.Timestamp.Date;

            // Check if there is already a check-in for this employee today
            var existingAttendance = await _context.Attendances
                .FirstOrDefaultAsync(a => a.EmployeeId == markAttendanceDto.EmployeeId && a.Date == today);

            if (existingAttendance != null)
                return new ApiResponse<AttendanceResponseVM>
                {
                    IsSuccess = false,
                    Message = "Employee has already marked attendance for today.",
                };

            // Define a standard start time (e.g., 10:00 AM) to determine if the check-in is late
            var standardInTime = today.AddHours(10);
            var status = markAttendanceDto.Timestamp > standardInTime ? "Late" : "Present";

            var newAttendance = new Attendance
            {
                EmployeeId = markAttendanceDto.EmployeeId,
                Date = today,
                CheckIn = markAttendanceDto.Timestamp,
                Status = status,
                Remarks = $"{status} check-in."
            };

            _context.Attendances.Add(newAttendance);
            await _context.SaveChangesAsync();

            // Map entity to DTO to return
            return new ApiResponse<AttendanceResponseVM>
            {
                IsSuccess = true,
                Message = $"Employee marked in successfully: {newAttendance.EmployeeId}",
                Data = new AttendanceResponseVM
                {
                    Id = newAttendance.Id,
                    EmployeeId = newAttendance.EmployeeId,
                    Date = newAttendance.Date,
                    CheckIn = newAttendance.CheckIn,
                    Status = newAttendance.Status,
                    Remarks = newAttendance.Remarks
                }
            };
        }

        public async Task<ApiResponse<AttendanceResponseVM>> MarkOut(MarkAttendanceRequestVM markAttendanceDto)
        {
            var today = markAttendanceDto.Timestamp.Date;

            // Find the attendance record for today to mark the check-out
            var attendanceToUpdate = await _context.Attendances
                .FirstOrDefaultAsync(a => a.EmployeeId == markAttendanceDto.EmployeeId && a.Date == today);

            if (attendanceToUpdate == null)
                return new ApiResponse<AttendanceResponseVM>
                {
                    IsSuccess = false,
                    Message = "Cannot mark out. No check-in record found for today.",
                };

            if (attendanceToUpdate.CheckOut.HasValue)
                return new ApiResponse<AttendanceResponseVM>
                {
                    IsSuccess = false,
                    Message = "Employee has already marked out for today.",
                };
            if (!attendanceToUpdate.CheckIn.HasValue)
                return new ApiResponse<AttendanceResponseVM>
                {
                    IsSuccess = false,
                    Message = "Cannot mark out before marking in.",
                };

            attendanceToUpdate.CheckOut = markAttendanceDto.Timestamp;

            // Optionally, you can calculate the duration worked
            var duration = attendanceToUpdate.CheckOut.Value - attendanceToUpdate.CheckIn.Value;
            attendanceToUpdate.DurationHours = duration.Hours;
            attendanceToUpdate.DurationMinutes = duration.Minutes;
            attendanceToUpdate.Remarks += $"Total work duration: {duration.Hours}h {duration.Minutes}m.";

            _context.Attendances.Update(attendanceToUpdate);
            await _context.SaveChangesAsync();

            // Map entity to DTO
            return new ApiResponse<AttendanceResponseVM>
            {
                IsSuccess = true,
                Message = $"Employee marked in successfully, {attendanceToUpdate.Remarks}",
                Data = new AttendanceResponseVM
                {
                    Id = attendanceToUpdate.Id,
                    EmployeeId = attendanceToUpdate.EmployeeId,
                    Date = attendanceToUpdate.Date,
                    CheckIn = attendanceToUpdate.CheckIn,
                    CheckOut = attendanceToUpdate.CheckOut,
                    Status = attendanceToUpdate.Status,
                    Remarks = attendanceToUpdate.Remarks
                }
            };
        }

        public async Task<ApiResponse<dynamic>> GetAttendanceHistory(int page, int pageSize, string SearchValue)
        {

            var query = _context.Attendances.Include(x => x.Employee)
           .AsQueryable();

            if (!string.IsNullOrEmpty(SearchValue))
            {
                string searchTerm = SearchValue.ToLower();

                query = query.Where(c =>
                    c.Employee.empName.ToLower().Contains(searchTerm) ||
                    c.Employee.empEmail.ToLower().Contains(searchTerm) ||
                    c.EmployeeId.ToString().Contains(searchTerm));
            }

            var totalCount = query.Count();

            var history = await query
                .Select(a => new AttendanceResponseVM // Project directly to DTO
                {
                    Id = a.Id,
                    EmployeeId = a.EmployeeId,
                    Employee = a.Employee.empName,
                    Date = a.Date,
                    CheckIn = a.CheckIn,
                    CheckOut = a.CheckOut,
                    Status = a.Status,
                    Remarks = a.Remarks
                }).Skip(page).Take(pageSize)
                .ToListAsync();

            return new ApiResponse<dynamic>
            {
                IsSuccess = true,
                Message = "Data retrieved successfully.",
                Data = new
                {
                    history,
                    TotalCount = totalCount
                }
            };
        }
    }
}
