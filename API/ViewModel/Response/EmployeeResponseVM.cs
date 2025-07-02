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
        public string empJobTitle { get; set; }
        public string empExperience { get; set; }
        public string? ImagePath { get; set; }
        public bool? isActive { get; set; }
    }

    public class EmployeeDetailsResponseVM
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
        public string Role { get; set; }
        public bool? isActive { get; set; }

        // 🧾 Salary Structure
        public decimal BasicSalary { get; set; }
        public decimal HRA { get; set; }
        public decimal ConveyanceAllowance { get; set; }
        public decimal SpecialAllowance { get; set; }
        public decimal OtherAllowance { get; set; }

        // 🏦 Bank Details
        public string BankAccountNumber { get; set; }
        public string? IFSCCode { get; set; }
        public string? BankName { get; set; }

        // 🆔 Govt Identifiers
        public string PAN { get; set; }
        public string? UAN { get; set; }
    }
}
