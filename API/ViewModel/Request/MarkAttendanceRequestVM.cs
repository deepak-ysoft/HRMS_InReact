namespace HRMS.ViewModel.Request
{
    public class MarkAttendanceRequestVM
    {
        public int EmployeeId { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;
    }
}
