using CandidateDetails_API.Models;
using System.ComponentModel.DataAnnotations;

namespace HRMS.ViewModel.Request
{
    public class CalendarRequestVM
    {
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
}
