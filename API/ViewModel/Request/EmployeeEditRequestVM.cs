using CandidateDetails_API.Model;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.ViewModel.Request
{
    public class EmployeeEditRequestVM
    {
        [Key]
        public int empId { get; set; }
        [Required]
        [RegularExpression("^[A-Za-z\\s]+(?: [A-Za-z0-9\\s]+)*$", ErrorMessage = "Please enter a valid name!!")]
        public string empName { get; set; }
        [Required]
        [RegularExpression("^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\\.[a-zA-Z]{2,}$", ErrorMessage = "Please enter a valid email address.")] // Email validation
        public string empEmail { get; set; }
        [Required]
        public string empNumber { get; set; }
        [Required]
        public DateTime empDateOfBirth { get; set; }
        [Required]
        public Gender empGender { get; set; }
        [Required]
        public string empJobTitle { get; set; }
        [Required]
        public string empExperience { get; set; }
        [Required]
        public DateTime empDateofJoining { get; set; }
        [Required]
        public string empAddress { get; set; }
        public string? ImagePath { get; set; }
        [NotMapped]
        public IFormFile? Photo { get; set; }
        public bool? isDelete { get; set; }
        public UserRoles Role { get; set; }
        public bool? isActive { get; set; }
    }
}
