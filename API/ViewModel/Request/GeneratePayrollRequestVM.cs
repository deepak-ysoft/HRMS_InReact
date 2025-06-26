namespace HRMS.ViewModel.Request
{
    public class GeneratePayrollRequestVM
    {
        public int EmployeeId { get; set; }
        public int Bonus { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
    }
}
