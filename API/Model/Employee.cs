﻿using HRMS.Model;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CandidateDetails_API.Model
{
    public class Employee : BaseEntity
    {
        [Key]
        public int empId { get; set; }

        [Required]
        [RegularExpression("^[A-Za-z\\s]+(?: [A-Za-z0-9\\s]+)*$", ErrorMessage = "Please enter a valid name!!")]
        public string empName { get; set; }

        [Required]
        [RegularExpression("^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\\.[a-zA-Z]{2,}$", ErrorMessage = "Please enter a valid email address.")]
        public string empEmail { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [RegularExpression("^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*#?&]{8,}$", ErrorMessage = "At least 8 char, with upper, lower, num & special char.")]
        public string empPassword { get; set; }

        [NotMapped]
        [Required]
        [Compare("empPassword")]
        [DataType(DataType.Password)]
        public string? empPasswordConfirm { get; set; }

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

        public UserRoles Role { get; set; }

        public bool? isActive { get; set; }

        // 🧾 === Salary Structure for Payslip ===
        public decimal BasicSalary { get; set; }
        public decimal HRA { get; set; }
        public decimal ConveyanceAllowance { get; set; }
        public decimal SpecialAllowance { get; set; }
        public decimal OtherAllowance { get; set; }

        // 🏦 === Bank Details ===
        public string BankAccountNumber { get; set; }
        public string IFSCCode { get; set; }
        public string? BankName { get; set; }

        // 💼 === Govt Identifiers ===
        public string PAN { get; set; }
        public string? UAN { get; set; }= "1001 2345 6789";// Universal Account Number for PF

        // 🔒 === Password Reset Fields ===
        public string? ResetToken { get; set; }
        public DateTime? ResetTokenExpiration { get; set; }
        public bool ResetTokenIsValid => ResetTokenExpiration > DateTime.Now;
    }

    public enum UserRoles
    {
        Admin=1,
        HR=2,
        Employee=3
    }

    public enum Gender
    {
        Male,
        Female,
        Other
    }
}
