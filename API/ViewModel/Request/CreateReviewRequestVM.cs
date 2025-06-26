namespace HRMS.ViewModel.Request
{
    public class CreateReviewRequestVM
    {
        public int EmployeeId { get; set; }
        public int ReviewerId { get; set; }
        public string Period { get; set; }
        public int Rating { get; set; }
        public string Comments { get; set; }
    }
}
