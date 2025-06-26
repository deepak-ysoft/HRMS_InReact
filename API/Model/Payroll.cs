using CandidateDetails_API.Model;
using System.ComponentModel.DataAnnotations;

namespace HRMS.Model
{
    public class Payroll : BaseEntity
    {
        [Key]
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public decimal BasicSalary { get; set; }
        public decimal HRA { get; set; }
        public decimal Bonus { get; set; }
        public decimal Deductions { get; set; }
        public decimal NetPay { get; set; }
        public string PayslipPath { get; set; }
        public Employee Employee { get; set; }
    }
}
