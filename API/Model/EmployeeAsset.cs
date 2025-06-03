using HRMS.Model;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CandidateDetails_API.Model
{
    public class EmployeeAsset : BaseEntity
    {
        [Key]
        public int AssetId { get; set; }
        [Required]
        public string AssetName { get; set; }
        public string Description { get; set; }
        public string? ImagePath { get; set; }
        [NotMapped]
        public IFormFile? Image { get; set; }
        public int EmpId { get; set; }
    }
}
