namespace HRMS.ViewModel.Response
{
    public class EmployeeDocumentResponseVM
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string DocumentType { get; set; }
        public string FileName { get; set; }
        public DateTime UploadedAt { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }
}
