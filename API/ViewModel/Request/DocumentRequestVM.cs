namespace HRMS.ViewModel.Request
{
    public class DocumentRequestVM
    {
        public IFormFile file { get; set; }
        public string documentType { get; set; }
        public DateTime? expiryDate { get; set; }
    }
}
