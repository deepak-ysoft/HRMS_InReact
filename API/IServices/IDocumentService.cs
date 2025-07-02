using HRMS.ViewModel.Request;
using HRMS.ViewModel.Response;

namespace HRMS.IServices
{
    public interface IDocumentService
    {
        Task<ApiResponse<EmployeeDocumentResponseVM>> UploadDocument(int employeeId, DocumentRequestVM model);
        Task<ApiResponse<dynamic>> GetDocumentsForEmployee(int employeeId, int page, int pageSize, string searchValue);
        Task<ApiResponse<dynamic>> DownloadDocument(int documentId);
    }
}
