using HRMS.ViewModel.Request;
using HRMS.ViewModel.Response;

namespace HRMS.IServices
{
    public interface IPerformanceReviewService
    {
        Task<PerformanceReviewResponseVM> CreateReview(CreateReviewRequestVM createReviewDto);
        Task<IEnumerable<PerformanceReviewResponseVM>> GetReviewsForEmployee(int employeeId);
    }
}
