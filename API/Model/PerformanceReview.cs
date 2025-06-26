using CandidateDetails_API.Model;
using System.ComponentModel.DataAnnotations;

namespace HRMS.Model
{
    public class PerformanceReview : BaseEntity
    {
        [Key]
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int ReviewerId { get; set; }
        public string Period { get; set; }
        public int Rating { get; set; }
        public string Comments { get; set; }
        public DateTime ReviewDate { get; set; }

        public Employee Employee { get; set; }
    }
}
