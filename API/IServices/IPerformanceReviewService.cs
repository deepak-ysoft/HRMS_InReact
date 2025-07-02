using HRMS.ViewModel.Request;
using HRMS.ViewModel.Response;

namespace HRMS.IServices
{
    public interface IPerformanceReviewService
    {
        Task<PerformanceReviewResponseVM> CreateReview(CreateReviewRequestVM createReviewDto);
        Task<ApiResponse<dynamic>> GetReviewsForEmployee(int empId, int page, int pageSize, string SearchValue);
    }
}
