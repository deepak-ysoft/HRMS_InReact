using HRMS.IServices;
using HRMS.ViewModel.Request;
using HRMS.ViewModel.Response;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentController : ControllerBase
    {
        private readonly IDocumentService _documentService;

        public DocumentController(IDocumentService documentService)
        {
            _documentService = documentService;
        }

        [HttpPost("upload/{employeeId}")]
        public async Task<IActionResult> Upload(int employeeId, [FromForm] DocumentRequestVM model)
        {
            var result = await _documentService.UploadDocument(employeeId, model);
            return Ok(result);
        }

        [HttpGet("GetDocuments")]
        public async Task<IActionResult> GetDocuments(int empId, int page = 1, int pageSize = 10, string searchValue = "")
        {
            var documents = await _documentService.GetDocumentsForEmployee(empId, page, pageSize, searchValue);
            return Ok(documents);
        }

        // In DocumentController.cs
        [HttpGet("download/{documentId}")]
        public async Task<IActionResult> Download(int documentId)
        {
            var response = await _documentService.DownloadDocument(documentId);
            if (!response.IsSuccess || response.Data == null)
                return NotFound(response.Message);

            // Use dynamic safely
            dynamic data = response.Data;

            return File(data.fileContents, data.contentType, data.FileName);
        }
    }
}
