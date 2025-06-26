using CandidateDetails_API.Model;
using System.ComponentModel.DataAnnotations;

namespace HRMS.Model
{
    public class EmployeeDocument : BaseEntity
    {
        [Key]
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string DocumentType { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public DateTime UploadedAt { get; set; }
        public DateTime? ExpiryDate { get; set; }

        public Employee Employee { get; set; }
    }
}
