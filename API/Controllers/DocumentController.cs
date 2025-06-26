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

        [HttpGet("GetDocuments/{employeeId}")]
        public async Task<IActionResult> GetDocuments(int employeeId)
        {
            var documents = await _documentService.GetDocumentsForEmployee(employeeId);
            return Ok(documents);
        }

        // In DocumentController.cs
        [HttpGet("download/{documentId}")]
        public async Task<IActionResult> Download(int documentId)
        {
            try
            {
                var response = await _documentService.DownloadDocument(documentId);
                return Ok(new ApiResponse<dynamic>
                {
                    IsSuccess = response.IsSuccess,
                    Message = response.Message,
                    Data = File(response.Data.fileContents, response.Data.contentType, response.Data.document.FileName)
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (FileNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
