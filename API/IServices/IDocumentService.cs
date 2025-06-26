using HRMS.ViewModel.Request;
using HRMS.ViewModel.Response;

namespace HRMS.IServices
{
    public interface IDocumentService
    {
        Task<ApiResponse<EmployeeDocumentResponseVM>> UploadDocument(int employeeId, DocumentRequestVM model);
        Task<ApiResponse<IEnumerable<EmployeeDocumentResponseVM>>> GetDocumentsForEmployee(int employeeId);
        Task<ApiResponse<dynamic>> DownloadDocument(int documentId);
    }
}
