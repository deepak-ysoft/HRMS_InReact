namespace HRMS.ViewModel.Response
{
    public class PayrollResponseVM
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public decimal NetPay { get; set; }
    }
}
