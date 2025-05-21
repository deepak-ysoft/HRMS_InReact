using CandidateDetails_API.Model;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.ViewModel.Response
{
    public class EmployeeResponseVM
    {
        public int empId { get; set; }
        public string empName { get; set; }
        public string empEmail { get; set; }
        public string empNumber { get; set; }
        public DateTime empDateOfBirth { get; set; }
        public string empGender { get; set; }
        public string empJobTitle { get; set; }
        public string empExperience { get; set; }
        public DateTime empDateofJoining { get; set; }
        public string empAddress { get; set; }
        public string? ImagePath { get; set; }
        public IFormFile? Photo { get; set; }
        public string Role { get; set; }
        public bool? isActive { get; set; }
    }
}
