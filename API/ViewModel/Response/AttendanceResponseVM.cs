namespace HRMS.ViewModel.Response
{
    public class AttendanceResponseVM
    {
        public int Id { get; set; }
        public int? EmployeeId { get; set; }
        public string? Employee { get; set; }
        public DateTime Date { get; set; }
        public DateTime? CheckIn { get; set; }
        public DateTime? CheckOut { get; set; }
        public string Status { get; set; }
        public string Remarks { get; set; }
    }
}
