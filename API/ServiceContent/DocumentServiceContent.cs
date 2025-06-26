using CandidateDetails_API.Model;
using HRMS.IServices;
using HRMS.Model;
using HRMS.ViewModel.Request;
using HRMS.ViewModel.Response;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;

namespace HRMS.ServiceContent
{
    public class DocumentServiceContent : IDocumentService
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        // Inject both the DbContext and the WebHostEnvironment
        public DocumentServiceContent(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        public async Task<ApiResponse<EmployeeDocumentResponseVM>> UploadDocument(int employeeId, DocumentRequestVM model)
        {
            // 1. Validate input
            if (model.file == null || model.file.Length == 0)
                return new ApiResponse<EmployeeDocumentResponseVM>
                {
                    IsSuccess = false,
                    Message = "File is empty or null."
                };

            var employeeExists = await _context.Employees.AnyAsync(e => e.empId == employeeId);
            if (!employeeExists)
                return new ApiResponse<EmployeeDocumentResponseVM>
                {
                    IsSuccess = false,
                    Message = "Employee not found."
                };


            // 2. Define the storage path and create the directory if it doesn't exist
            var uploadsFolderPath = Path.Combine(_environment.WebRootPath, "Documents");
            Directory.CreateDirectory(uploadsFolderPath); // This does nothing if the directory already exists

            // 3. Generate a unique file name to prevent conflicts
            var uniqueFileName = $"{Guid.NewGuid()}_{model.file.FileName}";
            var filePath = Path.Combine(uploadsFolderPath, uniqueFileName);

            // 4. Save the file to the server
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await model.file.CopyToAsync(stream);
            }

            // 5. Create the database record
            var newDocument = new EmployeeDocument
            {
                EmployeeId = employeeId,
                DocumentType = model.documentType,
                FileName = model.file.FileName, // Store the original, user-friendly name
                FilePath = Path.Combine("Documents", uniqueFileName), // Store the relative path for future retrieval
                UploadedAt = DateTime.UtcNow,
                ExpiryDate = model.expiryDate
            };

            _context.EmployeeDocuments.Add(newDocument);
            await _context.SaveChangesAsync();

            // 6. Return the DTO
            return new ApiResponse<EmployeeDocumentResponseVM>
            {
                IsSuccess = true,
                Message = "Data retrieved successfully.",
                Data = new EmployeeDocumentResponseVM
                {
                    Id = newDocument.Id,
                    EmployeeId = newDocument.EmployeeId,
                    DocumentType = newDocument.DocumentType,
                    FileName = newDocument.FileName,
                    UploadedAt = newDocument.UploadedAt,
                    ExpiryDate = newDocument.ExpiryDate
                }
            };
        }

        public async Task<ApiResponse<IEnumerable<EmployeeDocumentResponseVM>>> GetDocumentsForEmployee(int employeeId)
        {
            var data = await _context.EmployeeDocuments
                .Where(d => d.EmployeeId == employeeId)
                .OrderByDescending(d => d.UploadedAt)
                .Select(d => new EmployeeDocumentResponseVM
                {
                    Id = d.Id,
                    EmployeeId = d.EmployeeId,
                    DocumentType = d.DocumentType,
                    FileName = d.FileName,
                    UploadedAt = d.UploadedAt,
                    ExpiryDate = d.ExpiryDate
                })
                .ToListAsync();

            return new ApiResponse<IEnumerable<EmployeeDocumentResponseVM>>
            {
                IsSuccess = true,
                Message = "Data retrieved successfully.",
                Data = data
            };
        }

        public async Task<ApiResponse<dynamic>> DownloadDocument(int documentId)
        {
            // 1. Find the document metadata
            var document = await _context.EmployeeDocuments.FindAsync(documentId);
            if (document == null)
                return new ApiResponse<dynamic>
                {
                    IsSuccess = false,
                    Message = "Document not found."
                };

            // 2. Construct the full physical path to the file
            var physicalPath = Path.Combine(_environment.WebRootPath, document.FilePath);

            if (!File.Exists(physicalPath)) return new ApiResponse<dynamic>
            {
                IsSuccess = false,
                Message = "The document file was not found on the server."
            };

            // 3. Read the file into a byte array
            var fileContents = await File.ReadAllBytesAsync(physicalPath);

            // 4. Determine the MIME type (content type)
            var provider = new FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(document.FileName, out var contentType))
            {
                contentType = "application/octet-stream"; // Default MIME type
            }

            return new ApiResponse<dynamic>
            {
                IsSuccess = false,
                Message = "Document not found.",
                Data = (fileContents, contentType, document.FileName)
            };
        }
    }
}
