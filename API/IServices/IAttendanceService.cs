using HRMS.ViewModel.Request;
using HRMS.ViewModel.Response;

namespace HRMS.IServices
{

    public interface IAttendanceService
    {
        Task<ApiResponse<AttendanceResponseVM>> MarkIn(MarkAttendanceRequestVM markAttendanceDto);
        Task<ApiResponse<AttendanceResponseVM>> MarkOut(MarkAttendanceRequestVM markAttendanceDto);
        Task<ApiResponse<dynamic>> GetAttendanceHistory(int page, int pageSize, string SearchValue);
    }
}
