using System.ComponentModel.DataAnnotations;

namespace HRMS.ViewModel.Request
{
    public class AddDataFromExcelRequestVM
    {
        [Required]
        public IFormFile file { get; set; }
    }
}
