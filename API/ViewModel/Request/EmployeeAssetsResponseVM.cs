using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.ViewModel.Request
{
    public class EmployeeAssetsResponseVM
    {
        public int? AssetId { get; set; }
        [Required]
        public string AssetName { get; set; }
        public string Description { get; set; }
        public string? ImagePath { get; set; }
        [NotMapped]
        public IFormFile? Image { get; set; }
        public int EmpId { get; set; }
    }
}
