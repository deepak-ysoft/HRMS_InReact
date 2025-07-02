namespace HRMS.ViewModel.Response
{
    public class PayrollResponseVM
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string? Employee { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public decimal BasicSalary { get; set; }
        public decimal HRA { get; set; }
        public decimal Bonus { get; set; }
        public decimal Deductions { get; set; }
        public decimal NetPay { get; set; }
    }
}
