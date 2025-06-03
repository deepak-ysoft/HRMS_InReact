using CandidateDetails_API.Models;
using HRMS.ViewModel.Request;
using HRMS.ViewModel.Response;

namespace CandidateDetails_API.IServices
{
    public interface ICalendarService
    {
        public Task<ApiResponse<List<CalendarResponseVM>>> GetCalendarEventsAsync();
        public Task<ApiResponse<dynamic>> GetEventListAsync();
        public Task<dynamic> getCalendarByIdAsync(int id);
        public Task<ApiResponse<string>> AddEventAsync(CalendarRequestVM calendar);
        public Task<ApiResponse<string>> UpdateEventAsync(CalendarRequestVM calendar);
        public Task<bool> DeleteCalendarByIdAsync(int id);

    }
}
