using CandidateDetails_API.Model;
using HRMS.IServices;
using HRMS.Model;
using HRMS.ViewModel.Request;
using HRMS.ViewModel.Response;
using Microsoft.AspNetCore.Mvc;
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

            // 2. Define a custom storage path under the root of the project (e.g., /UploadedDocuments)
            var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "UploadedDocuments");
            Directory.CreateDirectory(uploadsFolderPath); // Create directory if not exists

            // 3. Generate a unique file name
            var uniqueFileName = $"{Guid.NewGuid()}_{model.file.FileName}";
            var filePath = Path.Combine(uploadsFolderPath, uniqueFileName);

            // 4. Save file to server
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await model.file.CopyToAsync(stream);
            }

            // 5. Create DB record
            var newDocument = new EmployeeDocument
            {
                EmployeeId = employeeId,
                DocumentType = model.documentType,
                FileName = model.file.FileName,
                FilePath = Path.Combine("UploadedDocuments", uniqueFileName), // relative path
                UploadedAt = DateTime.UtcNow,
                ExpiryDate = model.expiryDate
            };

            _context.EmployeeDocuments.Add(newDocument);
            await _context.SaveChangesAsync();

            // 6. Return response DTO
            return new ApiResponse<EmployeeDocumentResponseVM>
            {
                IsSuccess = true,
                Message = "Document uploaded successfully.",
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

        public async Task<ApiResponse<dynamic>> GetDocumentsForEmployee(int employeeId, int page, int pageSize, string searchValue)
        {
            var query = _context.EmployeeDocuments.Where(d => d.EmployeeId == employeeId).AsQueryable();

            // 1. Apply search filter if provided
            if (!string.IsNullOrEmpty(searchValue))
            {
                string searchTerm = searchValue.ToLower();
                query = query.Where(d => d.DocumentType.ToLower().Contains(searchTerm) ||
                                         d.FileName.ToLower().Contains(searchTerm));
            }

            var totalCount = await query.CountAsync();

            var data = await query
                .OrderByDescending(d => d.UploadedAt)
                .Select(d => new EmployeeDocumentResponseVM
                {
                    Id = d.Id,
                    EmployeeId = d.EmployeeId,
                    DocumentType = d.DocumentType,
                    FileName = d.FileName,
                    UploadedAt = d.UploadedAt,
                    ExpiryDate = d.ExpiryDate
                }).Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new ApiResponse<dynamic>
            {
                IsSuccess = true,
                Message = "Data retrieved successfully.",
                Data = new { documents = data, totalCount }
            };
        }

        public async Task<ApiResponse<dynamic>> DownloadDocument(int documentId)
        {
            var document = await _context.EmployeeDocuments.FindAsync(documentId);
            if (document == null)
            {
                return new ApiResponse<dynamic>
                {
                    IsSuccess = false,
                    Message = "Document not found (null document)."
                };
            }

            var webRootPath = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory());
            var physicalPath = Path.Combine(webRootPath, document.FilePath ?? "");

            if (!System.IO.File.Exists(physicalPath))
            {
                return new ApiResponse<dynamic>
                {
                    IsSuccess = false,
                    Message = $"File not found at: {physicalPath}"
                };
            }

            byte[] fileContents;
            try
            {
                fileContents = await System.IO.File.ReadAllBytesAsync(physicalPath);
            }
            catch (Exception ex)
            {
                return new ApiResponse<dynamic>
                {
                    IsSuccess = false,
                    Message = "Error reading file: " + ex.Message
                };
            }

            var provider = new FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(document.FileName, out var contentType))
            {
                contentType = "application/octet-stream";
            }

            return new ApiResponse<dynamic>
            {
                IsSuccess = true,
                Message = "Success",
                Data = new
                {
                    fileContents,
                    contentType,
                    document.FileName
                }
            };
        }

    }
}
