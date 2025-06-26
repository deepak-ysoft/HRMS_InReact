using HRMS.IServices;
using HRMS.ViewModel.Request;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PerformanceReviewController : ControllerBase
    {
        private readonly IPerformanceReviewService _performanceReviewService;

        public PerformanceReviewController(IPerformanceReviewService performanceReviewService)
        {
            _performanceReviewService = performanceReviewService;
        }

        [HttpPost("CreateReview")]
        public async Task<IActionResult> CreateReview([FromForm] CreateReviewRequestVM createReviewDto)
        {
            var result = await _performanceReviewService.CreateReview(createReviewDto);
            return Ok(result);
        }

        [HttpGet("GetReviews/{employeeId}")]
        public async Task<IActionResult> GetReviews(int employeeId)
        {
            var reviews = await _performanceReviewService.GetReviewsForEmployee(employeeId);
            return Ok(reviews);
        }
    }
}
