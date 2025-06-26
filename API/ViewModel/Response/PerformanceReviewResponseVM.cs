namespace HRMS.ViewModel.Response
{
    public class PerformanceReviewResponseVM
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int ReviewerId { get; set; }
        public string Period { get; set; }
        public int Rating { get; set; }
        public string Comments { get; set; }
        public DateTime ReviewDate { get; set; }
    }
}
