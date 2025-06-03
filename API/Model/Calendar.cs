using HRMS.Model;
using System.ComponentModel.DataAnnotations;

namespace CandidateDetails_API.Models
{
    public class Calendar : BaseEntity
    {
        [Key]
        public int? CalId { get; set; }
        [Required]
        public CalendarTitle Title { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public DateTime Start { get; set; }
        [Required]
        public DateTime End { get; set; }
    }

    public enum CalendarTitle
    {
        Birthday,
        Holiday,
        Event,
        Meeting,
        Leave
    }
}
