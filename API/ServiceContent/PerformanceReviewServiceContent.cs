using CandidateDetails_API.Model;
using HRMS.IServices;
using HRMS.Model;
using HRMS.ViewModel.Request;
using HRMS.ViewModel.Response;
using Microsoft.EntityFrameworkCore;

namespace HRMS.ServiceContent
{
    public class PerformanceReviewServiceContent : IPerformanceReviewService
    {
        private readonly ApplicationDbContext _context;

        public PerformanceReviewServiceContent(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PerformanceReviewResponseVM> CreateReview(CreateReviewRequestVM createReviewDto)
        {
            // 1. Validate the input
            if (createReviewDto.Rating < 1 || createReviewDto.Rating > 5)
            {
                throw new ArgumentException("Rating must be between 1 and 5.");
            }

            // 2. Validate that the employee and reviewer exist
            var employeeExists = await _context.Employees.AnyAsync(e => e.empId == createReviewDto.EmployeeId);
            var reviewerExists = await _context.Employees.AnyAsync(e => e.empId == createReviewDto.ReviewerId);

            if (!employeeExists)
            {
                throw new KeyNotFoundException($"The employee with ID {createReviewDto.EmployeeId} was not found.");
            }
            if (!reviewerExists)
            {
                throw new KeyNotFoundException($"The reviewer with ID {createReviewDto.ReviewerId} was not found.");
            }

            // Optional: Prevent duplicate reviews for the same period
            var reviewExists = await _context.PerformanceReviews
                .AnyAsync(r => r.EmployeeId == createReviewDto.EmployeeId && r.Period == createReviewDto.Period);

            if (reviewExists)
            {
                throw new InvalidOperationException($"A performance review for employee {createReviewDto.EmployeeId} for the period '{createReviewDto.Period}' already exists.");
            }

            // 3. Create the new review entity
            var newReview = new PerformanceReview
            {
                EmployeeId = createReviewDto.EmployeeId,
                ReviewerId = createReviewDto.ReviewerId,
                Period = createReviewDto.Period, // e.g., "Q2 2025"
                Rating = createReviewDto.Rating,
                Comments = createReviewDto.Comments,
                ReviewDate = DateTime.UtcNow
            };

            // 4. Save to the database
            _context.PerformanceReviews.Add(newReview);
            await _context.SaveChangesAsync();

            // 5. Map to DTO and return
            return new PerformanceReviewResponseVM
            {
                Id = newReview.Id,
                EmployeeId = newReview.EmployeeId,
                ReviewerId = newReview.ReviewerId,
                Period = newReview.Period,
                Rating = newReview.Rating,
                Comments = newReview.Comments,
                ReviewDate = newReview.ReviewDate
            };
        }

        public async Task<ApiResponse<dynamic>> GetReviewsForEmployee(int empId, int page, int pageSize, string SearchValue)
        {
            // 1. Check if the employee exists
            var employeeExists = await _context.Employees.AnyAsync(e => e.empId == empId);
            if (!employeeExists)
                throw new KeyNotFoundException($"The employee with ID {empId} was not found.");

            // 2. Retrieve all reviews for the employee
            var query = _context.PerformanceReviews.Where(r => r.EmployeeId == empId).AsQueryable();

            if (!string.IsNullOrEmpty(SearchValue))
            {
                string searchTerm = SearchValue.ToLower();
                query = query.Where(r => r.Comments.ToLower().Contains(searchTerm) ||
                r.Period.ToLower().Contains(searchTerm) ||
                r.ReviewDate.ToString().ToLower().Contains(searchTerm));
            }

            var totalCount = await query.CountAsync(); // Get total count for pagination

            var reviews =await query.OrderByDescending(r => r.ReviewDate) // Show the most recent first
              .Select(r => new PerformanceReviewResponseVM // Project directly to the DTO
              {
                  Id = r.Id,
                  EmployeeId = r.EmployeeId,
                  ReviewerId = r.ReviewerId,
                  Period = r.Period,
                  Rating = r.Rating,
                  Comments = r.Comments,
                  ReviewDate = r.ReviewDate
              }).Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new ApiResponse<dynamic>
            {
                IsSuccess = true,
                Message = "Data retrieved successfully.",
                Data = new
                {
                    salary = reviews,
                    TotalCount = totalCount
                }
            };
        }
    }
}