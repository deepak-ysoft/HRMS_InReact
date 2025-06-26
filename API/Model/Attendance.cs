using CandidateDetails_API.Model;
using System.ComponentModel.DataAnnotations;

namespace HRMS.Model
{
    public class Attendance
    {
        [Key]
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public DateTime Date { get; set; }
        public DateTime? CheckIn { get; set; }
        public DateTime? CheckOut { get; set; }
        public string Status { get; set; } // e.g., Present, Absent, Late
        public int? DurationHours { get; set; }
        public int? DurationMinutes { get; set; }
        public string Remarks { get; set; }

        public Employee Employee { get; set; }
    }
}
